using Analytics.Application.DTO;

namespace Analytics.Application.Interfaces;

public interface ILessonContextProvider
{
    Task<LessonContextDto?> GetAsync(Guid lessonId);
}