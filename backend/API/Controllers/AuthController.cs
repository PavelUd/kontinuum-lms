using System.Security.Principal;
using Auth.Application.Dto;
using Auth.Application.Interfaces;
using Core.Entities.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Users.Application.Interfaces;

namespace API.Controllers;

[Tags("Аутентификация")]
[ApiController]
[Route("api/auth")]
public class AuthController : Controller
{
    private readonly IAuthService _service;
    private readonly IUsersService _usersService;
    private readonly IIdentityUser _user;

    public AuthController(IAuthService service, IIdentityUser user, IUsersService usersService)
    {
        _service = service;
        _user = user;
        _usersService = usersService;
    }
    
    
    
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        var userAgent = HttpContext.Request.Headers["User-Agent"].ToString();
        var result = await _service.Authenticate(request.Login, request.Password);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }
    
    [HttpPost("register")]
    public async Task<IActionResult> Register(string login, string password)
    {
        var result = await _service.RegisterAsync(login, password);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }
    
    [Authorize]
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var result = await _usersService.GetUserById(_user.Id);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }
}