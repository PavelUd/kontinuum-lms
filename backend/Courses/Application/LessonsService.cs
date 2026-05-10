using AutoMapper;
using AutoMapper.QueryableExtensions;
using Contracts.Services;
using Core;
using Courses.Application.Interfaces;
using Courses.Domain.Entities;
using Courses.Domain.Enums;
using Courses.DTO.Lessons;
using Courses.Infrastructure.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Courses.Application;

public class LessonsService : ILessonsService, ILessonProvider
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
    
    public async Task<Result<List<SummaryLessonDto>>> GetAvailableLessons(Guid idCourse)
    {
        var result = _dbContext.Lessons
            .Where(x => x.CourseId == idCourse && x.Status != Status.Draft)
            .OrderBy(x => x.OrderIndex)
            .ProjectTo<SummaryLessonDto>(_mapper.ConfigurationProvider)
            .ToList();
        return await Result<List<SummaryLessonDto>>.SuccessAsync(result);
    }
    
    public async Task<Result<List<SummaryLessonDto>>> GetLessons(Guid idCourse)
    {
        var lessons = await _dbContext.Lessons
            .Where(x =>
                x.CourseId == idCourse &&
                (
                    x.Status == Status.Active ||
                    x.Status == Status.Archived ||
    
                    (
                        x.Status == Status.Draft &&
                        !_dbContext.Lessons.Any(y =>
                            y.DraftLessonId == x.Id &&
                            (
                                y.Status == Status.Active ||
                                y.Status == Status.Archived
                            ))
                    )
                ))
            .OrderBy(x => x.OrderIndex)
            .ProjectTo<SummaryLessonDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
    
        return await Result<List<SummaryLessonDto>>
            .SuccessAsync(lessons);
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
            if (lesson.DraftLessonId != null)
            {
                await DeleteDraft(lesson);
            }
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
    
    public async Task<Result<SummaryLessonDto>> GetLessonById(Guid idLesson)
    {
        var lesson = _dbContext.Lessons.Where(x => x.Id == idLesson).ProjectTo<SummaryLessonDto>(_mapper.ConfigurationProvider).FirstOrDefault();
        if (lesson == null)
        {
            return await Result<SummaryLessonDto>.SuccessAsync();
        }
        
        return await Result<SummaryLessonDto>.SuccessAsync(lesson);
        
    }
    
    public async Task<Guid> EnsureActiveLessonAsync(SummaryLessonDto draft, CancellationToken ct)
    {
        var activeLessonId = _dbContext.Lessons.FirstOrDefault(x => x.DraftLessonId == draft.Id)?.Id;

        if (activeLessonId == null)
        {
            var lesson = new Lesson()
            {
                DraftLessonId = draft.Id,
                CourseId = draft.CourseId,
                OrderIndex = draft.OrderIndex,
                Status = Status.Active,
                Title = draft.Title
            };
            _dbContext.Lessons.Add(lesson);
            await _dbContext.SaveChangesAsync(ct);
            activeLessonId = lesson.Id;
        }

        else
        {
            var patchRequest = new PatchLessonRequest
            {
                Title = draft.Title,
            };
            await PatchLesson(activeLessonId.Value, patchRequest
            );
        }

        return activeLessonId.Value;
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

    public async Task<Guid?> GetByLessonIdAsync(Guid lessonId)
    {
        return (await _dbContext.Lessons.FirstOrDefaultAsync(x => x.Id == lessonId))?.CourseId;
    }
    
    private async Task DeleteDraft(Lesson lesson)
    {
        if (lesson.DraftLessonId == null)
            return;

        var draftLesson = await _dbContext.Lessons
            .FirstOrDefaultAsync(x => x.Id == lesson.DraftLessonId);

        if (draftLesson == null)
            return;

        _dbContext.Lessons.Remove(draftLesson);
    }
}