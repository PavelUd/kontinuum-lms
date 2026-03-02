using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core;
using Courses.Application.Interfaces;
using Courses.Domain.Entities;
using Courses.DTO;
using Courses.Infrastructure;

namespace Courses.Application;

public class CoursesService : ICoursesService
{
    
    private  readonly ICoursesDbContext _dbContext;
    private readonly IMapper _mapper;

    public CoursesService(ICoursesDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }


    public  Result<List<CourseDTO>> GetCourses()
    {
       var result = _dbContext.Courses.ProjectTo<CourseDTO>(_mapper.ConfigurationProvider).ToList();
       return Result<List<CourseDTO>>.Success(result);
    }

    public Result<CourseDTO> GetCourse(Guid courseId)
    {
        var course = _dbContext.Courses.Where(x => x.Id == courseId).ProjectTo<CourseDTO>(_mapper.ConfigurationProvider).First();
        return Result<CourseDTO>.Success(course);
    }
    
    public Result<Guid> CreateCourse(CourseCreateRequest request)
    {
        try
        {
            var course = _mapper.Map<Course>(request);
            _dbContext.Courses.Add(course);
            _dbContext.SaveChanges();
            return Result<Guid>.Success(course.Id);
        }
        catch
        {
            return Result<Guid>.Failure("Failed to create course");
        }
    }
}