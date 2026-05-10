using Core;

namespace Contracts.Services.Courses;

public interface ILessonGuard
{
    public Task EnsureEditable(Guid lessonId);
}