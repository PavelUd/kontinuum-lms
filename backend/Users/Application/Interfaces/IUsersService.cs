using Contracts.Contracts;
using Contracts.Contracts.Users;
using Core;
using Users.Application.DTO;

namespace Users.Application.Interfaces;

public interface IUsersService
{
    public Task<Result<None>> RemoveUser(Guid idUser);
    public Task<Result<Guid>> CreateUser(CreateUserDto request);
    public Task<Result<T>> GetUserById<T>(Guid idUser) where T  : IUserDto;
}