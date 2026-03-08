using Core;
using Users.Application.DTO;

namespace Users.Application.Interfaces;

public interface IUsersService
{
    public Task<Result<UserDto>> GetUserById(Guid idUser);
}