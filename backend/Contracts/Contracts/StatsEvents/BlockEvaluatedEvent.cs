namespace Contracts.Contracts.StatsEvents;

public class BlockEvaluatedEvent
{
    public Guid UserId { get; set; }
    public Guid BlockId { get; set; }
    public Guid LessonId { get; set; }
    public bool AffectsScore { get; set; }
}