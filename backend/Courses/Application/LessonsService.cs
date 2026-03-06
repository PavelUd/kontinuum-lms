using AutoMapper;
using AutoMapper.QueryableExtensions;
using Contracts.Query;
using Core;
using Courses.Application.Interfaces;
using Courses.Domain.Entities;
using Courses.DTO.Courses;
using Courses.DTO.Lessons;
using MediatR;

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
        var result = _dbContext.Lessons.Where(x => x.CourseId == idCourse).ProjectTo<SummaryLessonDto>(_mapper.ConfigurationProvider).ToList();
        var blocksResult = await _mediator.Send(new GetLessonBlocksQuery(result.First().CourseId));
        return await Result<List<SummaryLessonDto>>.SuccessAsync(result);
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
    
    public async Task<Result<LessonDto>> GetLessonById(Guid idLesson)
    {
        var lesson = _dbContext.Lessons.FirstOrDefault(x => x.Id == idLesson);
        if (lesson == null)
        {
            return Result<LessonDto>.Success();
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
}