namespace Contracts.Services;

public interface ICoursesProvider
{
    public Dictionary<Guid, int> GetLessonCountsByCourseIds(Guid idUser);
    
    public Task<Dictionary<Guid, string>> GetCourseDictionary(List<Guid> ids);
}