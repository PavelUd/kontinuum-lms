using Contracts.Contracts;
using Contracts.Contracts.Users;
using Core;

namespace Contracts.Services;

public interface IUserQueryService
{
    Task<Result<UserAuthDto>> GetAuthUserByPhoneAsync(string phone);
    public Task<Result<T>> GetUserById<T>(Guid idUser) where T : IUserDto;
}