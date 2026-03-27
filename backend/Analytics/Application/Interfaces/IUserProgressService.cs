using Analytics.Application.DTO;

namespace Analytics.Application.Interfaces;

public interface IUserProgressService
{
    public List<Guid> GetCompletedBlocksByLesson(Guid idLesson);
    public List<LessonProgressDto> GetLessonsProgressByCourseId(Guid courseId);
}