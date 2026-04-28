using Analytics.Application.DTO;
using Analytics.Application.Interfaces;
using Analytics.Infrastructure;
using AutoMapper;
using AutoMapper.QueryableExtensions;
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
    private readonly IGroupProvider _groupProvider;
    private readonly IIdentityUser _identityUser;
    private readonly IUserQueryService _queryService;
    private readonly IMapper _mapper;

    public AnalyticProgressService(IAnalyticsDbContext analyticsDbContext, ILessonBlockStatsProvider lessonBlockStatsProvider, IGroupMembersProvider groupMembersProvider, IIdentityUser identityUser, IGroupProvider groupProvider, IMapper mapper, IUserQueryService queryService)
    {
        _analyticsDbContext = analyticsDbContext;
        _lessonBlockStatsProvider = lessonBlockStatsProvider;
        _groupMembersProvider = groupMembersProvider;
        _identityUser = identityUser;
        _groupProvider = groupProvider;
        _mapper = mapper;
        _queryService = queryService;
    }
    
    

    public async Task<CourseAnalyticsDto> GetCourseAnalytics(Guid courseId)
    {
        var (studentIds, usersCount) = await GetStudentsAsync(courseId);
        
        var progresses = await _analyticsDbContext.LessonProgresses
            .Where(x => x.CourseId == courseId)
            .Where(x => studentIds.Contains(x.UserId))
            .GroupBy(x => x.LessonId)
            .Select(g => new
            {
                LessonId = g.Key,
                SumScore = g.Sum(x => x.Score),
                SumProgress = g.Sum(x => x.Progress),
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
              return MapToAnalytics(x.LessonId,x.SumProgress, x.SumScore, usersCount, totalQuestions);
              
          }).ToList()
        };

        return result;
    }

    public async Task<LessonAnalyticsDto> GetLessonAnalytics(Guid lessonId, Guid courseId)
    {
        var (studentIds, usersCount) = await GetStudentsAsync(courseId);
        
        var query = _analyticsDbContext.LessonProgresses
            .Where(x => studentIds.Contains(x.UserId))
            .Where(x => x.LessonId == lessonId);
        
        var progressQuery = new
        {
            LessonId = lessonId,
            SumScore = await query.SumAsync(x => x.Score),
            SumProgress = await query.SumAsync(x => x.Progress),
        };
        
        var stats = (await _lessonBlockStatsProvider.GetByLessonsIdAsync([lessonId])).ToDictionary(x => x.LessonId);
        var totalQuestions = stats.TryGetValue(lessonId, out var q) ? q.ScoredBlocks : 1;
        
        return MapToAnalytics(lessonId,progressQuery.SumProgress, progressQuery.SumScore, usersCount, totalQuestions);
    }

    public async Task<List<GroupAnalyticsDto>> GetGroupsAnalytics(Guid courseId, Guid lessonId)
    {
        var groups = await _groupProvider.GetAvailableGroupsAsync(courseId);
        var members = await _groupMembersProvider.GetMembersGroups(groups.Select(x => x.Id).ToList());

        var result = new List<GroupAnalyticsDto>();
        
        foreach (var group in groups)
        {
            var item = new GroupAnalyticsDto()
            {
                AvgProgress = 0,
                Id = group.Id,
                Title = group.Title
            };

            if (members.TryGetValue(group.Id, out var membersId))
            {
                var progresses = _analyticsDbContext.LessonProgresses
                    .Where(x => x.LessonId == lessonId && membersId.Contains(x.UserId))
                    .Sum(x => x.Progress);

                item.AvgProgress = Math.Round( progresses / membersId.Count, 1);
            }

            result.Add(item);
        }
        return result;
    } 
    
    public async Task<List<UserAnalyticsDto>> GroupMembersProgress(Guid idGroup, Guid lessonId)
    {
        var members = (await _groupMembersProvider.GetMembersGroups([idGroup])).Values.SelectMany(x => x).ToList();

        var users = await _queryService.GetUsersDictionary(members.ToList());
        
        var progresses = await _analyticsDbContext.LessonProgresses
            .Where(x => x.LessonId == lessonId && members.Contains(x.UserId))
            .ToDictionaryAsync(
                x => x.UserId,
                x => x
            );
        
        return members.Select(member =>
        {
            users.TryGetValue(member, out var name);
            progresses.TryGetValue(member, out var progress);

            return new UserAnalyticsDto
            {
                Name = name ?? "",
                Id = member,
                Progress = Math.Round(progress?.Progress ?? 0, 1)
            };
        }).ToList();
        
    }
    
    private async Task<(List<Guid> studentIds, int usersCount)> GetStudentsAsync(Guid courseIdOrLessonId)
    {
        Guid? id = null;

        if (_identityUser.Role is Role.Teacher or Role.Curator)
            id = _identityUser.Id;

        var studentIds = await _groupMembersProvider.GetCourseStudentIds(courseIdOrLessonId, id);

        return (studentIds.ToList(), studentIds.Count());
    }
    
    private LessonAnalyticsDto MapToAnalytics(
        Guid lessonId,
        double sumProgress,
        double sumScore,
        int usersCount,
        int totalQuestions)
    {
        if (usersCount == 0)
        {
            return new LessonAnalyticsDto
            {
                LessonId = lessonId,
                AvgProgress = 0,
                AvgScore = 0
            };
        }

        if (totalQuestions == 0)
        {
            totalQuestions = 1;
        }

        var avgProgress = sumProgress / usersCount;
        var avgScore = ((double)sumScore / (usersCount * totalQuestions)) * totalQuestions;

        return new LessonAnalyticsDto
        {
            StudentsCount = usersCount,
            LessonId = lessonId,
            AvgProgress = Math.Round(avgProgress, 0),
            AvgScore = Math.Round(avgScore, 1)
        };
    }
    
    
}