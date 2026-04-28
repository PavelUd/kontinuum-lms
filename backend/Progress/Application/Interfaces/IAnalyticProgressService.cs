using Analytics.Application.DTO;

namespace Analytics.Application.Interfaces;

public interface IAnalyticProgressService
{
    public Task<CourseAnalyticsDto> GetCourseAnalytics(Guid courseId);
}