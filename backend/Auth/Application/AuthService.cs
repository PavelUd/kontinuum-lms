using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Auth.Application.Interfaces;
using Auth.Domain;
using Auth.Infrastructure;
using Contracts.Contracts.Users;
using Contracts.Services;
using Core;
using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Auth.Application;

public class AuthService : IAuthService
{
    
    private readonly Token _token;
    private readonly IAuthDbContext _context;
    private readonly IHashingService _hashingService;
    private readonly IUserQueryService _userQueryService;

    public AuthService(IOptions<Token> tokenOptions, IAuthDbContext context, IHashingService hashingService, IUserQueryService userQueryService)
    {
        _token = tokenOptions.Value;
        _context = context;
        _hashingService = hashingService;
        _userQueryService = userQueryService;
    }


    public async Task<Result<None>> LogoutAsync(string refreshToken)
    {
        var sessionResult = await GetValidRefreshSessionAsync(refreshToken);
        if (!sessionResult.Succeeded)
        {
            return await Result<None>.FailureAsync(sessionResult.Errors);
        }

        try
        {
            var session = sessionResult.Data;
            await _context.RefreshSessions
                .Where(x => x.UserId == session.UserId &&
                            x.Fingerprint == session.Fingerprint &&
                            x.Ua == session.Ua)
                .ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
            return await Result<None>.SuccessAsync();
        }
        catch (Exception ex)
        {
            return await Result<None>.FailureAsync(ex.Message);
        }
    }
    
    public async Task<Result<(string, string)>> Authenticate(string login, string password,  string fingerprint, string? userAgent, string? ip)
    {
        var userResult = await _userQueryService.GetAuthUserByPhoneAsync(login);
        if (!userResult.Succeeded)
        {
            return await Result<(string, string)>.FailureAsync(userResult.Errors);
        }
        var user =  userResult.Data;
        var credentials = _context.Credentials.FirstOrDefault(x => x.UserId == user.Id);
        if (credentials == null)
        {
            return await Result<(string, string)>.FailureAsync("Пользователь не аутентифицирован");
        }

        var isConfirmPassword = VerifyPassword(password, credentials.Password, credentials.Salt);
        if (!isConfirmPassword)
        {
            return await Result<(string, string)>.FailureAsync("Неверный пароль");
        }

        try
        {
            var role = user.Role;
            var tokens = await GenerateTokenPairAsync(credentials, role, fingerprint, userAgent, ip);
            return await Result<(string, string)>.SuccessAsync(tokens);
        }
        
        catch (Exception exception)
        {
            return await Result<(string, string)>.FailureAsync(exception.Message);
        }

    }
    
    
    public async Task<Result<(string, string)>> Refresh(string token)
    {
        var sessionResult = await GetValidRefreshSessionAsync(token);
        if (!sessionResult.Succeeded)
        {
            return await Result<(string, string)>.FailureAsync(sessionResult.Errors);
        }

        var session = sessionResult.Data;

        try
        {
            var user = await _userQueryService.GetUserById<UserAuthDto>(session.UserId);
            var accessToken = await GenerateJwtToken(session.UserId, user.Data.Role, new TimeSpan(4, 0, 0));
            var refreshToken =  GenerateRefreshToken();
            await RotateRefreshTokenAsync(refreshToken, session.UserId, session.Fingerprint, session.Ua, session.Ip);
            return await Result<(string, string)>.SuccessAsync((accessToken, refreshToken));
        }
        
        catch (Exception ex)
        {
            return await Result<(string, string)>.FailureAsync(ex.Message);
        }
    }
    
    private async Task<(string, string)> GenerateTokenPairAsync(Credential credentials, Role role,  string fingerprint, string? userAgent, string? ip)
    {
        var accessToken = await GenerateJwtToken(credentials.UserId,role, new TimeSpan(4, 0, 0));
        var refreshToken = GenerateRefreshToken();

        await RotateRefreshTokenAsync(refreshToken, credentials.UserId,  fingerprint,  userAgent,  ip);
        
        return (accessToken, refreshToken);
    }
    
    private async Task<Result<RefreshSession>> GetValidRefreshSessionAsync(string token)
    {
        var hashToken = _hashingService.Hash(token);

        var session = await _context.RefreshSessions
            .FirstOrDefaultAsync(x =>
                x.RefreshTokenHash == hashToken &&
                x.RevokedAt == null &&
                x.ExpiresAt > DateTimeOffset.UtcNow);

        if (session == null)
            return await Result<RefreshSession>.FailureAsync("Токен невалиден или истёк");

        return await Result<RefreshSession>.SuccessAsync(session);
    }
    
    private async Task RotateRefreshTokenAsync(string token, Guid userId, string fingerprint, string? userAgent, string? ip)
    {
        var hashToken = _hashingService.Hash(token);
        await _context.RefreshSessions
                .Where(x => x.UserId == userId &&
                            x.Fingerprint == fingerprint &&
                            x.Ua == userAgent)
                .ExecuteDeleteAsync();

            var session = new RefreshSession(
                userId,
                hashToken,
                fingerprint,
                userAgent,
                ip,
                DateTimeOffset.UtcNow.AddDays(7)
            );

            await _context.RefreshSessions.AddAsync(session);
            await _context.SaveChangesAsync();
            
    }

    
    private string GenerateRefreshToken()
    {
        var refreshToken = Guid.NewGuid().ToString();
        return refreshToken;
    }
    
    
    
    private async Task<string> GenerateJwtToken(Guid userId, Role role, TimeSpan lifetime)
    {
        var secret = Encoding.ASCII.GetBytes(_token.Secret);

        var handler = new JwtSecurityTokenHandler();
        var descriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new ("Id", userId.ToString()),
                new (ClaimTypes.Role, role.ToString()),
            }),
            Expires = DateTime.UtcNow.Add(lifetime),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(secret), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = handler.CreateToken(descriptor);
        return handler.WriteToken(token);
    }


    
    
    private bool VerifyPassword(string enteredPassword, string storedHash, string storedSalt)
    {
        var salt = Convert.FromBase64String(storedSalt);
        using var pbkdf2 = new Rfc2898DeriveBytes(enteredPassword, salt, 10000, HashAlgorithmName.SHA256);
        var hash = pbkdf2.GetBytes(32);
        var enteredHash = Convert.ToBase64String(hash);

        return enteredHash == storedHash;
    }
}