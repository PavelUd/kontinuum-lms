using Analytics.Application.DTO;

namespace Analytics.Application.Interfaces;

public interface IAnalyticProgressService
{
    public Task<CourseAnalyticsDto> GetCourseAnalytics(Guid courseId);
    public Task<LessonAnalyticsDto> GetLessonAnalytics(Guid lessonId, Guid courseId);

    public Task<List<GroupAnalyticsDto>> GetGroupsAnalytics(Guid courseId, Guid moduleId);

    public Task<List<UserAnalyticsDto>> GroupMembersProgress(Guid idGroup, Guid lessonId);
}