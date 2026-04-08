using AutoMapper;
using AutoMapper.QueryableExtensions;
using Contracts.Services;
using Core;
using Core.Entities;
using Core.Entities.Interfaces;
using Courses.Application.Interfaces;
using Courses.Domain.Entities;
using Courses.Domain.Enums;
using Courses.DTO.Courses;
using Courses.Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Courses.Application;

public class CoursesService : ICoursesService, ICoursesProvider
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
        var query = _dbContext.Courses.AsQueryable();
        var result = query.ProjectTo<SummaryCourseDto>(_mapper.ConfigurationProvider).ToList();
       return Result<List<SummaryCourseDto>>.Success(result);
    }

    public async Task<Result<None>> SetStatus(Status status, Guid idCourse)
    {
        var course = _dbContext.Courses.FirstOrDefault(x => x.Id == idCourse);
        if (course == null)
        {
            return await Result<None>.FailureAsync("Course not found");
        }

        try
        {
            course.Status = status;
            if (status == Status.Archived)
            {
               await ArchiveModulesAsync(course.Id);
            }
            
            await _dbContext.SaveChangesAsync();
            return await Result<None>.SuccessAsync();
        }
        
        catch (Exception e)
        {
            return await Result<None>.FailureAsync(e.Message);
        }
    }

    public async Task<Result<None>> DeleteCourse(Guid idCourse)
    {
        var course = _dbContext.Courses.FirstOrDefault(x => x.Id == idCourse);
        if (course == null)
        {
            return await Result<None>.FailureAsync("Course not found");
        }

        try
        {
            _dbContext.Courses.Remove(course);
            await _dbContext.SaveChangesAsync();
            return await Result<None>.SuccessAsync();
        }
        
        catch (Exception e)
        {
            return await Result<None>.FailureAsync(e.Message);
        }
    }

    public Result<SummaryCourseDto> GetCourse(Guid courseId)
    {
        var course = _dbContext.Courses.Where(x => x.Id == courseId).ProjectTo<SummaryCourseDto>(_mapper.ConfigurationProvider).First();
        return Result<SummaryCourseDto>.Success(course);
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

    public async Task<List<CourseLookup>> GetCourseLookup()
    {
        var query = _dbContext.Courses.Where(c => c.Status == Status.Active).AsQueryable();
        return await query.ProjectTo<CourseLookup>(_mapper.ConfigurationProvider).ToListAsync();
    }
    
    public async Task<Dictionary<Guid, string>> GetCourseDictionary(List<Guid> ids)
    {
        return await _dbContext.Courses
            .Where(c => ids.Contains(c.Id))
            .ToDictionaryAsync(x => x.Id, x => x.Name);
    }
    
    private async Task ArchiveModulesAsync(Guid courseId)
    {
        await _dbContext.Lessons
            .Where(x => x.CourseId == courseId)
            .ExecuteUpdateAsync(s => s
                .SetProperty(m => m.Status, Status.Archived));
    }

    public Dictionary<Guid, int> GetLessonCountsByCourseIds(Guid idUser)
    {
        return _dbContext.Lessons
            .Where(x => x.Status == Status.Active)
            .GroupBy(x => x.CourseId)
            .ToDictionary(x => x.Key, x => x.Count());
    }
}