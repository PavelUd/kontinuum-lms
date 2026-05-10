namespace Contracts.Services;

public interface ILessonProvider
{
    public Task<Guid?> GetByLessonIdAsync(Guid lessonId);
}