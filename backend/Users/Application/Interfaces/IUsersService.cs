using Contracts.Contracts;
using Contracts.Contracts.Users;
using Core;
using Users.Application.DTO;

namespace Users.Application.Interfaces;

public interface IUsersService
{
    public Task<Result<T>> GetUserById<T>(Guid idUser) where T  : IUserDto;
}