using System.Text.Json;
using Analytics.Application.Interfaces;
using BlockEngine.Application.DTO;
using BlockEngine.Application.Interfaces;
using Contracts.Contracts.StatsEvents;
using Core;
using Core.Entities.Interfaces;
using Hangfire;
using MediatR;

namespace Coordinator.Activities.CompleteBlock;

public record CompleteBlockRequest(Guid Id, JsonElement Payload);

public record CompleteBlockResponse(List<Guid> IdBlocks);

public record CompleteBlocksCommand(List<CompleteBlockRequest> Requests) : IRequest<Result<CompleteBlockResponse>>;

public class CompleteBlocksHandler : IRequestHandler<CompleteBlocksCommand, Result<CompleteBlockResponse>>
{
    
    private readonly IIdentityUser _identityUser;
    private readonly IBlockEvaluationService _blockEvaluationService;
    private readonly IBackgroundJobClient _jobs;

    public CompleteBlocksHandler(IIdentityUser identityUser, IBlockEvaluationService blockEvaluationService, IBackgroundJobClient jobs)
    {
        _identityUser = identityUser;
        _blockEvaluationService = blockEvaluationService;
        _jobs = jobs;
    }

    public async Task<Result<CompleteBlockResponse>> Handle(CompleteBlocksCommand request, CancellationToken cancellationToken)
    {
        var res = new CompleteBlockResponse(new List<Guid>());
        var evaluationItems = request.Requests.Select(x => new BlockEvaluateItem(x.Id, x.Payload)).ToList();
        var evaluationResult = await _blockEvaluationService.EvaluateAsync(evaluationItems);

        foreach (var result in evaluationResult.Where(x=>x.IsCorrect))
        {
            _jobs.Enqueue<IAnalyticsService>(x =>
                x.ProcessBlockCompleted(new BlockEvaluatedEvent()
                {
                    UserId = _identityUser.Id,
                    AffectsScore = false,
                    BlockId = result.BlockId,
                    LessonId = result.LessonId,
                }));
            
            res.IdBlocks.Add(result.BlockId);
        }

        return await Result<CompleteBlockResponse>.SuccessAsync(res);
    }
}