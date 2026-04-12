using Contracts.Contracts;
using Contracts.Contracts.Users;
using Core;
using Users.Application.DTO;
using Users.Domain;

namespace Users.Application.Interfaces;

public interface IUsersService
{
    public Task<Result<None>> RemoveUser(Guid idUser);
    public Task<Guid> CreateUser<T>(T request) where T : IUserCreateRequest;
    public Task<Result<T>> GetUserById<T>(Guid idUser) where T  : IUserDto;
    public Task<Result<None>> SetStatus (Guid idUser, UserStatus status);
}