using Contracts.Contracts.StatsEvents;

namespace Analytics.Application.Interfaces;

public interface ILessonProgressProcessor
{
    public Task ProcessBlockCompleted(BlockEvaluatedEvent evaluatedEvent);
}