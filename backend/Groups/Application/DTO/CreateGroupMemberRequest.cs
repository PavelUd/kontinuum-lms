using Groups.Domain;

namespace Groups.Application.DTO;

public class CreateGroupMemberRequest
{
    public Guid UserId { get; set; }
    public Guid GroupId { get; set; }
    public  GroupRole Role { get; set; }
}