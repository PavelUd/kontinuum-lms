using Contracts.Services.Courses;
using Core;
using Courses.Domain.Enums;
using Courses.Infrastructure.Interfaces;

namespace Courses.Application;

public class LessonGuard : ILessonGuard
{
    private  readonly ICoursesDbContext _dbContext;

    public LessonGuard(ICoursesDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task EnsureEditable(Guid lessonId)
    {
        var lesson = _dbContext.Lessons.FirstOrDefault(x => x.Id == lessonId);
        if(lesson == null)
        {
           throw new Exception("Занятие не найдено");
        }

        if (lesson.Status != Status.Draft)
        {
            throw new Exception("Занятие нельзя изменять");
        }

        return Task.CompletedTask;
    }
}