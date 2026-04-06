using Analytics.Application.DTO;
using Analytics.Application.Interfaces;
using Analytics.Infrastructure;
using Contracts.Services;
using Microsoft.EntityFrameworkCore;

namespace Analytics.Application;

public class AnalyticProgressService : IAnalyticProgressService
{
    private readonly IAnalyticsDbContext _analyticsDbContext;
    private readonly  ILessonBlockStatsProvider  _lessonBlockStatsProvider;

    public AnalyticProgressService(IAnalyticsDbContext analyticsDbContext, ILessonBlockStatsProvider lessonBlockStatsProvider)
    {
        _analyticsDbContext = analyticsDbContext;
        _lessonBlockStatsProvider = lessonBlockStatsProvider;
    }

    public async Task<List<LessonAnalyticsDto>> GetLessonsProgressAnalytics(Guid courseId)
    {
        var progresses = await _analyticsDbContext.LessonProgresses
            .Where(x => x.CourseId == courseId)
            .GroupBy(x => x.LessonId)
            .Select(g => new
            {
                LessonId = g.Key,
                UsersCount = g.Count(),
                SumScore = g.Sum(x => x.Score),
                SumProgress = g.Sum(x => x.Progress)
            })
            .ToListAsync();

        var lessonIds = progresses.Select(x => x.LessonId).ToList();

        var stats = (await _lessonBlockStatsProvider.GetByLessonsIdAsync(lessonIds)).ToDictionary(x => x.LessonId);

        var result = progresses.Select(x =>
        {
            var totalQuestions = stats.TryGetValue(x.LessonId, out var q) ? q.ScoredBlocks : 1;

            double avgScore = 0;
            double avgProgress = 0;
            if (x.UsersCount > 0)
            {
                avgScore = ((double)x.SumScore / (x.UsersCount * 5)) * 5;
            }
            avgProgress = (x.SumProgress / x.UsersCount);

            return new LessonAnalyticsDto
            {
                LessonId = x.LessonId,
                AvgProgress = Math.Round(avgProgress, 0),
                AvgScore = Math.Round(avgScore, 1)
            };
        }).ToList();

        return result;
    } 
}