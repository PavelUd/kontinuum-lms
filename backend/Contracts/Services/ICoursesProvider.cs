namespace Contracts.Services;

public interface ICoursesProvider
{
    public Dictionary<Guid, int> GetLessonCountsByCourseIds(Guid idUser);
}