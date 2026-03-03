using Core;
using Courses.DTO.Lessons;

namespace Courses.Application.Interfaces;

public interface ILessonsService
{
    public Result<List<SummaryLessonDto>> GetLessons(Guid idCourse);
    public Result<Guid> CreateLesson(LessonCreateRequest request, Guid idCourse);
    public Result<None> DeleteLesson(Guid idLesson);
}