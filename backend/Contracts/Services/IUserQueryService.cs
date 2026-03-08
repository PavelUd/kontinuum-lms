using Contracts.Contracts;
using Core;

namespace Contracts.Services;

public interface IUserQueryService
{
    Task<Result<UserAuthDto>> GetAuthUserByPhoneAsync(string phone);
}