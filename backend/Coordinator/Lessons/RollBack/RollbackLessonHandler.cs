using BlockEngine.Application.Interfaces;
using Coordinator.interfaces;
using Core;
using Courses.Application.Interfaces;
using Courses.DTO.Lessons;
using MediatR;

namespace Coordinator.Lessons.RollBack;

public record RollbackLessonCommand(Guid IdLesson)  : IRequest<Result<None>>;

public class RollbackLessonHandler  : IRequestHandler<RollbackLessonCommand, Result<None>>
{
    
    private readonly ILessonsService _lessonsService;
    private readonly IBlockSynchronizer _blockSynchronizer;
    private readonly ICoordinatorContext _context;

    public RollbackLessonHandler(ILessonsService lessonsService, IBlockSynchronizer blockSynchronizer, ICoordinatorContext context)
    {
        _lessonsService = lessonsService;
        _blockSynchronizer = blockSynchronizer;
        _context = context;
    }

    public async Task<Result<None>> Handle(RollbackLessonCommand request, CancellationToken ct)
    {
        var lesson = (await _lessonsService.GetLessonById(request.IdLesson)).Data;
        if (lesson?.DraftLessonId == null)
        {
            return await Result<None>.SuccessAsync();
        }
        
        await using var tx = await _context.BeginTransactionAsync(ct);
        try
        {
            var draftLessonId = lesson.DraftLessonId;
            await _lessonsService.PatchLesson(draftLessonId.Value, new PatchLessonRequest() {Title = lesson.Title});
            await _blockSynchronizer.RollbackAsync(lesson.Id, lesson.DraftLessonId.Value);
            await tx.CommitAsync(ct);
            
            return await Result<None>.SuccessAsync();
        }
        catch(Exception e)
        {
            await tx.RollbackAsync(ct);
            return await Result<None>.FailureAsync($"ошибка отката изменений занятия : {e.Message}");
        }
        
    }
}