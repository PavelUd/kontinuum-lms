using Core;

namespace Auth.Application.Interfaces;

public interface IAuthService
{

    public Task<Result<(string, string)>> Authenticate(string login, string password, string fingerprint,
        string? userAgent, string? ip);

    public Task<Result<(string, string)>> Refresh(string token);
    public Task<Result<None>> LogoutAsync(string refreshToken);
}