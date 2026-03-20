using System.Security.Claims;

namespace Core.Entities.Interfaces;

public interface IIdentityUser
{
    public Guid Id { get; init; }
    public Role? Role { get; init; }
}