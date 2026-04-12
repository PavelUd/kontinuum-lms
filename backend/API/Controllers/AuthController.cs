using System.Security.Principal;
using Auth.Application.Dto;
using Auth.Application.Interfaces;
using Coordinator.Auth;
using Core;
using Core.Entities.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Users.Application.DTO;
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
    private readonly IMediator _mediator;

    public AuthController(IAuthService service, IIdentityUser user, IUsersService usersService, IMediator mediator)
    {
        _service = service;
        _user = user;
        _usersService = usersService;
        _mediator = mediator;
    }
    
    
    
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        var userAgent = HttpContext.Request.Headers["User-Agent"].ToString();
        var fingerprint = HttpContext.Request.Headers["X-Fingerprint"].ToString();

        var result = await _service.Authenticate(request.Login, request.Password, fingerprint, userAgent, ip);

        if (!result.Succeeded)
            return BadRequest(result);

        SaveRefreshTokenCookie(result.Data.Item2);
        
        return Ok(new Result<string> { Data = result.Data.Item1, Succeeded = true });
    }
    
    [HttpPost("refresh")]
    public async Task<IActionResult> Authenticate()
    {
        var oldRefreshToken = Request.Cookies["refresh_token"];
        if (string.IsNullOrEmpty(oldRefreshToken))
            return Unauthorized();
        
        var result = await _service.Refresh(oldRefreshToken);
        
        SaveRefreshTokenCookie(result.Data.Item2);
        return Ok(new Result<string> { Data = result.Data.Item1, Succeeded = true });
    }
    

    [HttpPost("link/{token}/activate")]
    public async Task<IActionResult> ActivateLink(Guid token, [FromBody] ActivateLinkRequest request)
    {
        var ip  = HttpContext.Connection.RemoteIpAddress?.ToString();
        var userAgent = HttpContext.Request.Headers["User-Agent"].ToString();
        var fingerprint = HttpContext.Request.Headers["X-Fingerprint"].ToString();

        var command = new ActivateLinkCommand(token, request.Password,fingerprint,userAgent,ip);
        var result = await _mediator.Send(command);
        
        if (!result.Succeeded)
            return BadRequest(result);
        
        SaveRefreshTokenCookie(result.Data.Item2);
        
        return Ok(new Result<string> { Data = result.Data.Item1, Succeeded = true });
    }


    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var oldRefreshToken = Request.Cookies["refresh_token"];

        if (string.IsNullOrEmpty(oldRefreshToken))
            return NoContent();
        
        var result =  await _service.LogoutAsync(oldRefreshToken);
        
        if (!result.Succeeded)
            return BadRequest(result);
        
        RemoveRefreshTokenCookie();
        return NoContent();
    }
    
    [Authorize]
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var result = await _usersService.GetUserById<UserDto>(_user.Id);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }
    
    private void SaveRefreshTokenCookie(string refreshToken)
    {
        
        //На проде поменять  Secure на true 
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = false,               
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddDays(7),
            Path = "/"
        };

        Response.Cookies.Append("refresh_token", refreshToken, cookieOptions);
    }
    
    private void RemoveRefreshTokenCookie()
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.Strict,
            Path = "/"
        };

        Response.Cookies.Delete("refresh_token", cookieOptions);
    }
}