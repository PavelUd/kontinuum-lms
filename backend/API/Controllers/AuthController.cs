using Auth.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Tags("Аутентификация")]
[ApiController]
[Route("api/auth")]
public class AuthController : Controller
{
    private readonly IAuthService _service;

    public AuthController(IAuthService service)
    {
        _service = service;
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login(string login, string password)
    {
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        var userAgent = HttpContext.Request.Headers["User-Agent"].ToString();
        var result = await _service.Authenticate(login, password);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }
    
    [HttpPost("register")]
    public async Task<IActionResult> Register(string login, string password)
    {
        var result = await _service.RegisterAsync(login, password);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }
}