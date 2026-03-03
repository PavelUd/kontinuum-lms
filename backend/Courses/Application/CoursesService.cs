using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core;
using Courses.Application.Interfaces;
using Courses.Domain.Entities;
using Courses.DTO;
using Courses.DTO.Courses;

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


    public  Result<List<SummaryCourseDto>> GetCourses()
    {
       var result = _dbContext.Courses.ProjectTo<SummaryCourseDto>(_mapper.ConfigurationProvider).ToList();
       return Result<List<SummaryCourseDto>>.Success(result);
    }

    public Result<CourseDto> GetCourse(Guid courseId)
    {
        var course = _dbContext.Courses.Where(x => x.Id == courseId).ProjectTo<CourseDto>(_mapper.ConfigurationProvider).First();
        return Result<CourseDto>.Success(course);
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