namespace Groups.Application.DTO;

public class PatchGroupRequest
{
    public string? Title { get; set; }
    
    public Guid? CourseId { get; set; }
}