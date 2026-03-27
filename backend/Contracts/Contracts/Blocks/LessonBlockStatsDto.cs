namespace Contracts.Contracts.Blocks;

public class LessonBlockStatsDto
{
    public Guid LessonId { get; set; }
    public int TotalBlocks { get; set; }
    public int ScoredBlocks { get; set; }
}