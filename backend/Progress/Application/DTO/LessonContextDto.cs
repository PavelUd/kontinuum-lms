namespace Analytics.Application.DTO;

public class LessonContextDto
{
    public Guid LessonId { get; set; }
    public Guid CourseId { get; set; }
    public int TotalBlocks { get; set; }
    public int ScoredBlocks { get; set; }
}