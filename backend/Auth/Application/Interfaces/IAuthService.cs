using Core;

namespace Auth.Application.Interfaces;

public interface IAuthService
{
    public Task<Result<string>> RegisterAsync(string login, string password);
    public Task<Result<string>> Authenticate(string login, string password);
}