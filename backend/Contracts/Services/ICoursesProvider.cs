namespace Contracts.Services;

public interface ICoursesProvider
{
    public Dictionary<Guid, int> GetLessonCountsByCourseIds(List<Guid> courseIds);
}