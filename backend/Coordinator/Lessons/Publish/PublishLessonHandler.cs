using BlockEngine.Application.Interfaces;
using Coordinator.interfaces;
using Coordinator.User.Create;
using Core;
using Courses.Application.Interfaces;
using Courses.Domain.Enums;
using Courses.DTO.Lessons;
using MediatR;

namespace Coordinator.Lessons.Publish;

public record PublishLessonCommand(Guid IdDraft) : IRequest<Result<None>>;

public class PublishLessonHandler : IRequestHandler<PublishLessonCommand, Result<None>>
{
    
    private readonly ILessonsService _lessonsService;
    private readonly IBlockSynchronizer _blockSynchronizer;
    private readonly ICoordinatorContext _context;

    public PublishLessonHandler(ILessonsService lessonsService, IBlockSynchronizer blockSynchronizer, ICoordinatorContext context)
    {
        _lessonsService = lessonsService;
        _blockSynchronizer = blockSynchronizer;
        _context = context;
    }

    public async Task<Result<None>> Handle(PublishLessonCommand request, CancellationToken ct)
    {
        var draft = await _lessonsService.GetLessonById(request.IdDraft);
        if (draft.Data == null)
        {
            return await Result<None>.FailureAsync();
        }
        
        await using var tx = await _context.BeginTransactionAsync(ct);
        try
        {
            var activeLessonId = await _lessonsService.EnsureActiveLessonAsync(draft.Data, ct);
            await _blockSynchronizer.PublishAsync(draft.Data.Id, activeLessonId);
            await tx.CommitAsync(ct);
            
            return await Result<None>.SuccessAsync();
        }
        catch(Exception e)
        {
            await tx.RollbackAsync(ct);
            return await Result<None>.FailureAsync($"ошибка публикации : {e.Message}");
        }
    }
}