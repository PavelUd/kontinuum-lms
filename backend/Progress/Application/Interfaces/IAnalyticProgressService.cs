using Analytics.Application.DTO;

namespace Analytics.Application.Interfaces;

public interface IAnalyticProgressService
{
    public Task<List<LessonAnalyticsDto>> GetLessonsProgressAnalytics(Guid courseId);
}