using AutoMapper;
using AutoMapper.QueryableExtensions;
using Contracts.Contracts;
using Contracts.Services;
using Core;
using Microsoft.EntityFrameworkCore;
using Users.Application.DTO;
using Users.Application.Interfaces;
using Users.Infrastructure;

namespace Users.Application;

public class UsersService : IUsersService, IUserQueryService
{
    
    private readonly IUsersDbContext _context;
    private readonly IMapper _mapper;

    public UsersService(IUsersDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public Task<Result<UserAuthDto>> GetAuthUserByPhoneAsync(string phone)
    {
        var firstOrDefault = _context.Users.Where(x => x.Phone == phone).ProjectTo<UserAuthDto>(_mapper.ConfigurationProvider).FirstOrDefault();
        return firstOrDefault == null 
            ? Result<UserAuthDto>.FailureAsync("User not found") 
            : Result<UserAuthDto>.SuccessAsync(firstOrDefault);
    }

    public async Task<Result<UserDto>> GetUserById(Guid idUser)
    {
        var user = await _context.Users.Where(x => x.Id== idUser).ProjectTo<UserDto>(_mapper.ConfigurationProvider).FirstOrDefaultAsync();
        return await Result<UserDto>.SuccessAsync(user);
    }
}