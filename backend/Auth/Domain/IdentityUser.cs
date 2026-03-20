using System.Security.Claims;
using Core.Entities;
using Core.Entities.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Auth.Domain;

public class IdentityUser : IIdentityUser
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public IdentityUser(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid Id
    {
        get
        {
            var value = _httpContextAccessor.HttpContext?
                .User
                .FindFirst("Id")?
                .Value;

            return value != null ? Guid.Parse(value) : Guid.Empty;
        }
        init { }
    }
    
    public Role? Role
    {
        get
        {
            var roleClaim = _httpContextAccessor.HttpContext?
                .User
                .FindFirst(ClaimTypes.Role)
                ?.Value;

            if (roleClaim == null) return null;

            if (Enum.TryParse<Role>(roleClaim, true, out var role)) return role;

            return null;
        }
        init { }
    }
}