using Core;
using Courses.Domain.Enums;
using Courses.DTO.Lessons;

namespace Courses.Application.Interfaces;

public interface ILessonsService
{
    public Task<Result<List<SummaryLessonDto>>> GetLessons(Guid idCourse);
    public Task<Result<Guid>> CreateLesson(LessonCreateRequest request, Guid idCourse);
    public Task<Result<None>> DeleteLesson(Guid idLesson);

    public Task<Result<None>> SetLessonStatus(Guid idLesson, Status status);
    
    public Task<Result<None>> UpdateTitle(string title, Guid id);
    public Task<Result<LessonDto>> GetLessonById(Guid idLesson);
}