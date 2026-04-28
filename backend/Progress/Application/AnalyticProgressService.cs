using Analytics.Application.DTO;
using Analytics.Application.Interfaces;
using Analytics.Infrastructure;
using Contracts.Services;
using Core.Entities;
using Core.Entities.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Analytics.Application;

public class AnalyticProgressService : IAnalyticProgressService
{
    private readonly IAnalyticsDbContext _analyticsDbContext;
    private readonly  ILessonBlockStatsProvider  _lessonBlockStatsProvider;
    private readonly IGroupMembersProvider _groupMembersProvider;
    private readonly IIdentityUser _identityUser;

    public AnalyticProgressService(IAnalyticsDbContext analyticsDbContext, ILessonBlockStatsProvider lessonBlockStatsProvider, IGroupMembersProvider groupMembersProvider, IIdentityUser identityUser)
    {
        _analyticsDbContext = analyticsDbContext;
        _lessonBlockStatsProvider = lessonBlockStatsProvider;
        _groupMembersProvider = groupMembersProvider;
        _identityUser = identityUser;
    }

    public async Task<CourseAnalyticsDto> GetCourseAnalytics(Guid courseId)
    {
        Guid? id = null;
        if (_identityUser.Role is Role.Teacher or Role.Curator)
        {
            id = _identityUser.Id;
        }

        var studentIds = await _groupMembersProvider.GetCourseStudentIds(courseId, id);
        var usersCount = studentIds.Count();
        var progresses = await _analyticsDbContext.LessonProgresses
            .Where(x => x.CourseId == courseId)
            .Where(x => studentIds.Contains(x.UserId))
            .GroupBy(x => x.LessonId)
            .Select(g => new
            {
                LessonId = g.Key,
                SumScore = g.Sum(x => x.Score),
                SumProgress = g.Sum(x => x.Progress),
                AvgScore = g.Average(x => x.Score),
                AvgProgress = g.Average(x => x.Progress)
            })
            .ToListAsync();

        var lessonIds = progresses.Select(x => x.LessonId).ToList();

        var stats = (await _lessonBlockStatsProvider.GetByLessonsIdAsync(lessonIds)).ToDictionary(x => x.LessonId);

        var result = new CourseAnalyticsDto
        {
          StudentsCount  = usersCount,
          Lessons = progresses.Select(x =>
          {
              var totalQuestions = stats.TryGetValue(x.LessonId, out var q) ? q.ScoredBlocks : 1;

              double avgScore = 0;
              double avgProgress = 0;
              if (usersCount > 0)
              {
                  avgScore = ((double)x.SumScore / (usersCount * 5)) * 5;
              }
              avgProgress = (x.SumProgress / usersCount);

              return new LessonAnalyticsDto
              {
                  LessonId = x.LessonId,
                  AvgProgress = Math.Round(avgProgress, 0),
                  AvgScore = Math.Round(avgScore, 1)
              };
          }).ToList()
        };

        return result;
    } 
}