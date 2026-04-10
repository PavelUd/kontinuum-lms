using Users.Domain;

namespace Users.Application.DTO;

public class SetUserStatusRequest
{
    public UserStatus Status { get; set; }
}