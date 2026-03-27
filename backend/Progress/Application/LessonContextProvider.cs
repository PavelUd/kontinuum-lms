using Analytics.Application.DTO;
using Analytics.Application.Interfaces;
using Contracts.Services;

namespace Analytics.Application;

public class LessonContextProvider : ILessonContextProvider
{
    private readonly ILessonProvider _courseProvider;
    private readonly ILessonBlockStatsProvider _statsProvider;

    public LessonContextProvider(
        ILessonProvider courseProvider,
        ILessonBlockStatsProvider statsProvider)
    {
        _courseProvider = courseProvider;
        _statsProvider = statsProvider;
    }

    public async Task<LessonContextDto?> GetAsync(Guid lessonId)
    {
        var course = await _courseProvider.GetByLessonIdAsync(lessonId);
        if (course == null) return null;

        var stats = await _statsProvider.GetByLessonIdAsync(lessonId);

        return new LessonContextDto
        {
            LessonId = lessonId,
            CourseId = course.Value,
            TotalBlocks = stats.TotalBlocks,
            ScoredBlocks = stats.ScoredBlocks
        };
    }
}