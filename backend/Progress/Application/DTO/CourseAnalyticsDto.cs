namespace Analytics.Application.DTO;

public class CourseAnalyticsDto
{
    public List<LessonAnalyticsDto> Lessons { get; set; }
    public int StudentsCount { get; set; }
}