using Analytics.Application.Interfaces;
using Analytics.Domain;
using Analytics.Infrastructure;
using Contracts.Contracts.StatsEvents;
using Core;
using Hangfire;
using Microsoft.EntityFrameworkCore;

namespace Analytics.Application;

public class AnalyticsService : IAnalyticsService
{
    private readonly ILessonContextProvider _lessonContextProvider;
    private readonly IAnalyticsDbContext _analyticsDbContext;

    public AnalyticsService(
        ILessonContextProvider lessonContextProvider,
        IAnalyticsDbContext analyticsDbContext)
    {
        _lessonContextProvider = lessonContextProvider;
        _analyticsDbContext = analyticsDbContext;
    }

    private async Task ProcessInternal(BlockEvaluatedEvent e)
    {
        // 1
        var exists = await _analyticsDbContext.BlockCompletions
            .AnyAsync(x => x.BlockId == e.BlockId && x.UserId == e.UserId);

        if (exists)
        {
            return;
        }

        // 2
        var lessonProgress = await _analyticsDbContext.LessonProgresses
            .FirstOrDefaultAsync(x => x.UserId == e.UserId && x.LessonId == e.LessonId);

        if (lessonProgress == null)
        {
            lessonProgress = await CreateLessonProgress(e.LessonId, e.UserId);
            if (lessonProgress == null)
                return;
        }

        // 3
        CreateBlockCompletion(e.UserId, e.LessonId, e.BlockId, e.AffectsScore);

        // 4
        lessonProgress.Progress = await RecalculateProgress(e.LessonId, e.UserId);
        lessonProgress.Score += e.AffectsScore ? 1 : 0;

        // 5
        try
        {
            await _analyticsDbContext.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            // duplicate insert (unique constraint violation)
            // safe to ignore because operation is idempotent
        }
    }
    
    
    public async Task ProcessBlockCompleted(BlockEvaluatedEvent e)
    {
        using (var connection = JobStorage.Current.GetConnection())
        using (connection.AcquireDistributedLock(
                   $"lesson-progress:{e.UserId}:{e.LessonId}",
                   TimeSpan.FromSeconds(10)))
        {
            await ProcessInternal(e);
        }
    }

    private void CreateBlockCompletion(Guid userId, Guid lessonId, Guid blockId, bool affectsScore)
    {
        var entity = new BlockCompletion
        {
            UserId = userId,
            LessonId = lessonId,
            BlockId = blockId,
            AffectsScore = affectsScore
        };

        _analyticsDbContext.BlockCompletions.Add(entity);
    }

    private async Task<LessonProgress?> CreateLessonProgress(Guid lessonId, Guid userId)
    {
        var context = await _lessonContextProvider.GetAsync(lessonId);

        if (context == null || context.TotalBlocks == 0)
            return null;

        var progress = new LessonProgress
        {
            UserId = userId,
            CourseId = context.CourseId,
            LessonId = context.LessonId,
            Progress = 0,
            Score = 0
        };

        _analyticsDbContext.LessonProgresses.Add(progress);
        return progress;
    }

    private async Task<double> RecalculateProgress(Guid lessonId, Guid userId)
    {
        var completed = await _analyticsDbContext.BlockCompletions
            .CountAsync(x => x.LessonId == lessonId && x.UserId == userId) + 1;

        var context = await _lessonContextProvider.GetAsync(lessonId);

        if (context == null || context.TotalBlocks == 0)
            return 0;

        return (double)completed / context.TotalBlocks * 100;
    }

    private async Task<int> RecalculateScore(Guid lessonId, Guid userId)
    {
        return await _analyticsDbContext.BlockCompletions
            .CountAsync(x =>
                x.LessonId == lessonId &&
                x.UserId == userId &&
                x.AffectsScore);
    }
}