using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Auth.Application.Interfaces;
using Auth.Domain;
using Auth.Infrastructure;
using Contracts.Services;
using Core;
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

    
    public async Task<Result<string>> RegisterAsync(string login, string password)
    {
        if (!IsUniqueLogin(login))
        {
            return await Result<string>.FailureAsync("Такой логин уже есть");
        }

        try
        {
            var (passwordHash, salt) = _hashingService.HashWithSalt(password);
            _context.Credentials.Add(new Credential
            {
                UserId = Guid.NewGuid(),
                Password = passwordHash,
                Salt = salt,
            });
            await _context.SaveChangesAsync();
            var token = await Authenticate(login, password);
            if (!token.Succeeded)
            {
                return  await Result<string>.FailureAsync(token.Errors);
            }
            return await Result<string>.SuccessAsync();
        }

        catch (Exception exception)
        {
            return await Result<string>.FailureAsync(exception.Message);
        }
    }
    
    public async Task<Result<string>> Authenticate(string login, string password)
    {
        var userResult = await _userQueryService.GetAuthUserByPhoneAsync(login);
        if (!userResult.Succeeded)
        {
            return await Result<string>.FailureAsync(userResult.Errors);
        }
        var user =  userResult.Data;
        var credentials = _context.Credentials.FirstOrDefault(x => x.UserId == user.Id);
        if (credentials == null)
        {
            return await Result<string>.FailureAsync("Пользователь не аутентифицирован");
        }

        var isConfirmPassword = VerifyPassword(password, credentials.Password, credentials.Salt);
        if (!isConfirmPassword)
        {
            return await Result<string>.FailureAsync("Неверный пароль");
        }

        var role = user.Role;
        var tokens = await GenerateJwtToken(credentials,role, new TimeSpan(4, 0, 0));
        
        return await Result<string>.SuccessAsync(tokens);

    }
    
    private async Task<string> GenerateJwtToken(Credential credentials,string role, TimeSpan lifetime)
    {
        var secret = Encoding.ASCII.GetBytes(_token.Secret);

        var handler = new JwtSecurityTokenHandler();
        var descriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new ("Id", credentials.UserId.ToString()),
                new (ClaimTypes.Role, role),
            }),
            Expires = DateTime.UtcNow.Add(lifetime),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(secret), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = handler.CreateToken(descriptor);
        return handler.WriteToken(token);
    }
    
    //warning
    private bool IsUniqueLogin(string login)
    {
        return true;
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