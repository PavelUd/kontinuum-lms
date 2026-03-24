using Contracts.Contracts.StatsEvents;

namespace Analytics.Application.Interfaces;

public interface IAnalyticsService
{
    public Task ProcessBlockCompleted(BlockEvaluatedEvent evaluatedEvent);
}