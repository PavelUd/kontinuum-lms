using AutoMapper;
using AutoMapper.QueryableExtensions;
using Contracts.Query;
using Core;
using Core.Entities;
using Core.Entities.Interfaces;
using Courses.Application.Interfaces;
using Courses.Domain.Entities;
using Courses.Domain.Enums;
using Courses.DTO;
using Courses.DTO.Courses;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Courses.Application;

public class CoursesService : ICoursesService
{
    
    private  readonly ICoursesDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly IIdentityUser _identityUser;

    public CoursesService(ICoursesDbContext dbContext, IMapper mapper,IIdentityUser identityUser)
    {
        _dbContext = dbContext;
        _mapper = mapper;
        _identityUser = identityUser;
    }


    public  Result<List<SummaryCourseDto>> GetCourses()
    { 
        var query = _dbContext.Courses.AsQueryable();
        if(_identityUser.Role == Role.Student)
        {
            query = query.Where(c => c.Status == Status.Active);
        }
        
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
    
    private async Task ArchiveModulesAsync(Guid courseId)
    {
        await _dbContext.Lessons
            .Where(x => x.CourseId == courseId)
            .ExecuteUpdateAsync(s => s
                .SetProperty(m => m.Status, Status.Archived));
    }
}