using AutoMapper;
using AutoMapper.QueryableExtensions;
using Contracts.Query;
using Core;
using Courses.Application.Interfaces;
using Courses.Domain.Entities;
using Courses.Domain.Enums;
using Courses.DTO.Lessons;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Courses.Application;

public class LessonsService : ILessonsService
{
    private  readonly ICoursesDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly IMediator _mediator;

    public LessonsService(ICoursesDbContext dbContext, IMapper mapper, IMediator mediator)
    {
        _dbContext = dbContext;
        _mapper = mapper;
        _mediator = mediator;
    }
    
    public async Task<Result<List<SummaryLessonDto>>> GetLessons(Guid idCourse)
    {
        var result = _dbContext.Lessons
            .Where(x => x.CourseId == idCourse)
            .OrderBy(x => x.OrderIndex)
            .ProjectTo<SummaryLessonDto>(_mapper.ConfigurationProvider)
            .ToList();
        return await Result<List<SummaryLessonDto>>.SuccessAsync(result);
    }

    public async Task<Result<None>> UpdateTitle(string title, Guid id)
    {
        var lesson = _dbContext.Lessons.FirstOrDefault(x => x.Id == id);
        if (lesson == null)
        {
            return await Result<None>.SuccessAsync();
        }
        lesson.Title = title;
        await _dbContext.SaveChangesAsync();
        return await Result<None>.SuccessAsync();
    }
    
    
    public async Task<Result<Guid>> CreateLesson(LessonCreateRequest request, Guid idCourse)
    {
        try
        {
            var lesson = _mapper.Map<Lesson>(request);
            lesson.CourseId = idCourse;
            lesson.Status = 0;
            var total = await _dbContext.Lessons
                .CountAsync(x => x.CourseId == lesson.CourseId);

            var position = Math.Max(1, Math.Min(request.OrderIndex, total + 1));
            
            await ShiftRange(lesson.CourseId, position, null, +1);

            lesson.OrderIndex = position;

            _dbContext.Lessons.Add(lesson);
            await _dbContext.SaveChangesAsync(); ;
            return await Result<Guid>.SuccessAsync(lesson.Id);
        }
        catch
        {
            return await Result<Guid>.FailureAsync("Failed to create course");
        }
    }

    public async Task<Result<None>> DeleteLesson(Guid idLesson)
    {
        var lesson = _dbContext.Lessons.FirstOrDefault(x => x.Id == idLesson);
        if (lesson == null)
        {
            return await Result<None>.SuccessAsync();
        }
        var index = lesson.OrderIndex;
        var courseId = lesson.CourseId;
        
        try
        {
            _dbContext.Lessons.Remove(lesson);
            await ShiftRange(courseId, index + 1, null, -1);
            await _dbContext.SaveChangesAsync();
            return await Result<None>.SuccessAsync();
        }
        catch
        {
            return await Result<None>.FailureAsync("Failed to remove lesson");
        }
    }

    public async Task<Result<None>> PatchLesson(Guid idLesson, PatchLessonRequest request)
    {
        try
        {
            var lesson = _dbContext.Lessons.FirstOrDefault(x => x.Id == idLesson);
            if (lesson == null)
            {
                return await Result<None>.FailureAsync("Lesson not found");
            }
            _mapper.Map(request, lesson);
            await _dbContext.SaveChangesAsync();
            return await Result<None>.SuccessAsync();
        }
        catch (Exception e)
        {
            return await Result<None>.FailureAsync(e.Message);
        }
    }

    public async Task<Result<None>> SetLessonStatus(Guid idLesson, Status status)
    {
        var lesson = _dbContext.Lessons.FirstOrDefault(x => x.Id == idLesson);
        if (lesson == null)
        {
            return await Result<None>.FailureAsync("Lesson not found");
        }
        if(status == Status.Active){
            var course = _dbContext.Courses.FirstOrDefault(x => x.Id == lesson.CourseId);
            if (course == null || course.Status == Status.Archived)
                return await Result<None>.FailureAsync("Cannot activate lesson in archived course");
        }

        try
        {
            lesson.Status = status;
            await _dbContext.SaveChangesAsync();
            return await Result<None>.SuccessAsync();
        }
        
        catch (Exception e)
        {
            return await Result<None>.FailureAsync(e.Message);
        }
    }
    
    public async Task<Result<LessonDto>> GetLessonById(Guid idLesson)
    {
        var lesson = _dbContext.Lessons.FirstOrDefault(x => x.Id == idLesson);
        if (lesson == null)
        {
            return await Result<LessonDto>.SuccessAsync();
        }

        try
        {
            var lessonDto = _mapper.Map<LessonDto>(lesson);
            var block = await _mediator.Send(new GetLessonBlocksQuery(lessonDto.Id));

            if (!block.Succeeded) 
            {
                return await Result<LessonDto>.FailureAsync(block.Errors);
            }

            lessonDto.Blocks = block.Data;
            return await Result<LessonDto>.SuccessAsync(lessonDto);
        }

        catch(Exception ex)
        {
            return await Result<LessonDto>.FailureAsync(ex.Message);
        }
    }
    
    
    private async Task ShiftRange(
        Guid courseId,
        int? from,
        int? to,
        int delta)
    {
        var query = _dbContext.Lessons
            .Where(x => x.CourseId == courseId);

        if (from.HasValue)
            query = query.Where(x => x.OrderIndex >= from.Value);

        if (to.HasValue)
            query = query.Where(x => x.OrderIndex <= to.Value);

        await query.ExecuteUpdateAsync(s => s
            .SetProperty(x => x.OrderIndex, x => x.OrderIndex + delta));
    }
}