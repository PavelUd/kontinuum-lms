using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core;
using Courses.Application.Interfaces;
using Courses.Domain.Entities;
using Courses.DTO.Courses;
using Courses.DTO.Lessons;

namespace Courses.Application;

public class LessonsService : ILessonsService
{
    private  readonly ICoursesDbContext _dbContext;
    private readonly IMapper _mapper;

    public LessonsService(ICoursesDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }
    
    public  Result<List<SummaryLessonDto>> GetLessons(Guid idCourse)
    {
        var result = _dbContext.Lessons.Where(x => x.CourseId == idCourse).ProjectTo<SummaryLessonDto>(_mapper.ConfigurationProvider).ToList();
        return Result<List<SummaryLessonDto>>.Success(result);
    }
    
    public Result<Guid> CreateLesson(LessonCreateRequest request, Guid idCourse)
    {
        try
        {
            var lesson = _mapper.Map<Lesson>(request);
            lesson.CourseId = idCourse;
            lesson.Status = 0;
            var lastOrderIndex = _dbContext.Lessons
                .Where(x => x.CourseId == lesson.CourseId)
                .OrderByDescending(x => x.OrderIndex)
                .Select(x => x.OrderIndex)
                .FirstOrDefault();

            lesson.OrderIndex = lastOrderIndex + 1;
            
            _dbContext.Lessons.Add(lesson);
            _dbContext.SaveChanges();
            return Result<Guid>.Success(lesson.Id);
        }
        catch
        {
            return Result<Guid>.Failure("Failed to create course");
        }
    }

    public Result<None> DeleteLesson(Guid idLesson)
    {
        var lesson = _dbContext.Lessons.FirstOrDefault(x => x.Id == idLesson);
        if (lesson == null)
        {
            return Result<None>.Success();
        }

        try
        {
            _dbContext.Lessons.Remove(lesson);
            _dbContext.SaveChanges();
            return Result<None>.Success();
        }
        catch
        {
            return Result<None>.Failure("Failed to remove lesson");
        }
    }
}