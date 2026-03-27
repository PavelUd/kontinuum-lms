using Analytics.Application.DTO;
using Analytics.Application.Interfaces;
using Analytics.Domain;
using Analytics.Infrastructure;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Contracts.Services;
using Core.Entities.Interfaces;

namespace Analytics.Application;

public class UserProgressService : IUserProgressService
{
    private readonly IAnalyticsDbContext _analyticsDbContext;
    private readonly IIdentityUser _user;
    private readonly IMapper _mapper;

    public UserProgressService(IAnalyticsDbContext analyticsDbContext, IIdentityUser user, IMapper mapper)
    {
        _analyticsDbContext = analyticsDbContext;
        _user = user;
        _mapper = mapper;
    }

    public List<Guid> GetCompletedBlocksByLesson(Guid idLesson)
    {
        return _analyticsDbContext.BlockCompletions.Where(x => x.LessonId == idLesson && x.UserId == _user.Id).Select(x => x.BlockId).ToList();
    }

    private IQueryable<LessonProgress> QueryLessonsProgress(List<Guid> courseIds)
    {
        return _analyticsDbContext.LessonProgresses
            .Where(x => courseIds.Contains(x.CourseId) && x.UserId == _user.Id);
    }
    
    
    public List<LessonProgressDto> GetLessonsProgressByCourseId(Guid courseId)
    {
        return QueryLessonsProgress(new List<Guid> { courseId })
            .ProjectTo<LessonProgressDto>(_mapper.ConfigurationProvider)
            .ToList();
    }
}