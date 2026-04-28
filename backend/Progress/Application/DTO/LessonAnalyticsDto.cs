namespace Analytics.Application.DTO;

public class LessonAnalyticsDto
{
    public Guid LessonId { get; set; }
    
    public double AvgProgress { get; set; }
    
    public int StudentsCount  { get; set; }
    
    public double AvgScore { get; set; }
}