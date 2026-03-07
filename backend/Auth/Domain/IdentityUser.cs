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

    public string? Role
    {
        get
        {
            return _httpContextAccessor.HttpContext?
                .User
                .FindFirst("Admin")?
                .Value;
        }
        init { }
    }
}