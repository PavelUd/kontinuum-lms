namespace BlockEngine.Application.DTO;

public class BlockEvaluationResult
{
    public Guid BlockId { get; set; }
    public Guid LessonId { get; set; }
    public bool IsCorrect { get; set; }
}