using System.Text.Json;
using Analytics.Application.Interfaces;
using BlockEngine.Application.DTO;
using BlockEngine.Application.Interfaces;
using Contracts.Contracts.StatsEvents;
using Core;
using Core.Entities.Interfaces;
using Hangfire;
using MediatR;
using Tracking.Application.DTO;
using Tracking.Application.Interface;

namespace Coordinator.Activities.AnswerQuestion;

public record AnswerQuestionRequest(JsonElement Payload);

public record AnswerQuestionCommand(Guid BlockId, JsonElement Payload ) : IRequest<Result<AnswerQuestionResponse>>;


public class AnswerQuestionHandler : IRequestHandler<AnswerQuestionCommand, Result<AnswerQuestionResponse>>
{
    private readonly IIdentityUser _identityUser;
    private readonly IBlockEvaluationService _blockEvaluationService;
    private readonly ITrackingService _trackingService;
    private readonly IBackgroundJobClient _jobs;

    public AnswerQuestionHandler(IBackgroundJobClient jobs, ITrackingService trackingService, IIdentityUser identityUser, IBlockEvaluationService blockEvaluationService)
    {
        _jobs = jobs;
        _trackingService = trackingService;
        _identityUser = identityUser;
        _blockEvaluationService = blockEvaluationService;
    }

    public async Task<Result<AnswerQuestionResponse>> Handle(AnswerQuestionCommand request, CancellationToken cancellationToken)
    {
        var evaluationResult = await _blockEvaluationService.EvaluateAsync(new List<BlockEvaluateItem>()
        {
            new (request.BlockId, request.Payload)
        });

        if (evaluationResult.Count == 0)
            return await Result<AnswerQuestionResponse>.FailureAsync("Блок не найден");

        var result = evaluationResult[0];
        
        var attempt = CreateAttempt(request.BlockId,result.LessonId, request.Payload, result.IsCorrect);
        await _trackingService.SaveAttempt(attempt);

        _jobs.Enqueue<ILessonProgressProcessor>(x =>
            x.ProcessBlockCompleted(new BlockEvaluatedEvent()
            {
                UserId = _identityUser.Id,
                AffectsScore = true,
                BlockId = request.BlockId,
                LessonId = result.LessonId,
            })
        );
        
        return await Result<AnswerQuestionResponse>.SuccessAsync(new AnswerQuestionResponse{IsCompleted = result.IsCorrect});
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