namespace Contracts.Contracts.Groups;

public class GroupPreview
{
    public Guid Id { get; set; }
    
    public Guid CourseId { get; set; }
    public string Title { get; set; }
}