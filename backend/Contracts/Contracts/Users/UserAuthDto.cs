namespace Contracts.Contracts.Users;

public class UserAuthDto : IUserDto
{
    public string Role { get; set; }
    public Guid Id { get; set; }
}