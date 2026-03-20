using Core.Entities;

namespace Contracts.Contracts.Users;

public class UserAuthDto : IUserDto
{
    public Role Role { get; set; }
    public Guid Id { get; set; }
}