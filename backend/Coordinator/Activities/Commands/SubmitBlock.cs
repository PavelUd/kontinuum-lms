using System.Text.Json;
using Analytics.Application.Interfaces;
using BlockEngine.Application.Interfaces;
using BlockEngine.Domain.Enum;
using Contracts.Contracts.StatsEvents;
using Core;
using Core.Entities.Interfaces;
using Hangfire;
using MediatR;
using Tracking.Application.DTO;
using Tracking.Application.Interface;

namespace Coordinator.Activities.Commands;

public record SubmitBlockRequest(JsonElement Payload);

public record SubmitBlockCommand(Guid BlockId, JsonElement Payload ) : IRequest<Result<SubmitBlockResponse>>;


public class SubmitBlockHandler: IRequestHandler<SubmitBlockCommand, Result<SubmitBlockResponse>>
{
    private readonly IIdentityUser _identityUser;
    private readonly IBlockService _blockService;
    private readonly ITrackingService _trackingService;
    private readonly IBackgroundJobClient _jobs;

    public SubmitBlockHandler(IBlockService blockService,IBackgroundJobClient jobs, ITrackingService trackingService, IIdentityUser identityUser)
    {
        _blockService = blockService;
        _jobs = jobs;
        _trackingService = trackingService;
        _identityUser = identityUser;
    }

    public async Task<Result<SubmitBlockResponse>> Handle(SubmitBlockCommand request, CancellationToken cancellationToken)
    {
        var block = await _blockService.GetBlockByIdAsync(request.BlockId);

        if (block is null)
            return await Result<SubmitBlockResponse>.FailureAsync("Блок не найден");
/*
        var isCorrect = await _blockService.CheckBLock(
            block.Type,
            block.Content,
            request.Payload
        );
*/

        var isCorrect = true;
        var affectsScore = false;
        if (ShouldTrackAttempt(block.Type))
        {
            affectsScore = true;
            var attempt = CreateAttempt(request.BlockId,block.LessonId, request.Payload, isCorrect);
            await _trackingService.SaveAttempt(attempt);
        }

        _jobs.Enqueue<IAnalyticsService>(x =>
            x.ProcessBlockCompleted(new BlockEvaluatedEvent()
            {
                UserId = _identityUser.Id,
                AffectsScore = affectsScore,
                BlockId = request.BlockId,
                LessonId = block.LessonId,
            })
        );
        
        return await Result<SubmitBlockResponse>.SuccessAsync(new SubmitBlockResponse{IsCompleted = isCorrect});
    }
    
    private static bool ShouldTrackAttempt(BlockType type)
    {
        return type is BlockType.ChoiceQuestion or BlockType.OpenQuestion;
    }
    
    private SaveAttemptRequest CreateAttempt(Guid blockId,Guid lessonId, object payload, bool isCorrect)
    {
        return new SaveAttemptRequest
        {
            UserId = _identityUser.Id,
            LessonId = lessonId,
            BlockId = blockId,
            Answer = payload?.ToString() ?? string.Empty,
            IsCorrect = isCorrect
        };
    }
}