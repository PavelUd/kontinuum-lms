using Core;
using Hangfire;
using MediatR;
using Tracking.Application.Interface;

namespace Coordinator.Activities.Engagement;

public record BlockEngagementRequest(Guid Id, Guid LessonId, double TotalTimeSpent);

public record  BlockEngagementCommand(List<BlockEngagementRequest> Requests) : IRequest<Result<None>>;

public class BlockEngagementsHandler  : IRequestHandler<BlockEngagementCommand, Result<None>>
{
    private readonly IBackgroundJobClient _jobs;

    public BlockEngagementsHandler(IBackgroundJobClient jobs)
    {
        _jobs = jobs;
    }

    public Task<Result<None>> Handle(BlockEngagementCommand request, CancellationToken cancellationToken)
    {
        foreach (var result in request.Requests)
        {
            _jobs.Enqueue<IBlockEngagementProcessor>(x =>
                x.ProcessInternal(result.Id, result.LessonId, result.TotalTimeSpent));
        }

        return Result<None>.SuccessAsync();
    }
}