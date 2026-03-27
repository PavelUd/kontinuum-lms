using Contracts.Contracts.Blocks;

namespace Contracts.Services;

public interface ILessonBlockStatsProvider
{
    public Task<LessonBlockStatsDto> GetByLessonIdAsync(Guid lessonId);
    public Task<List<LessonBlockStatsDto>> GetByLessonsIdAsync(List<Guid> lessonIds);
}