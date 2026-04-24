namespace Groups.Application.DTO;

public class GroupMemberDto
{
    public Guid Id {get; set;}
    public string FullName { get; set; }
    public Guid UserId { get; set; }
    public Guid GroupId { get; set; }
}