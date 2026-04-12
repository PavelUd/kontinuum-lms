using AutoMapper;
using AutoMapper.QueryableExtensions;
using Contracts.Contracts;
using Contracts.Contracts.Users;
using Contracts.Services;
using Core;
using Microsoft.EntityFrameworkCore;
using Users.Application.DTO;
using Users.Application.Helpers;
using Users.Application.Interfaces;
using Users.Domain;
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

    public async Task<Result<T>> GetUserById<T>(Guid idUser) where T : IUserDto
    {
        var user = await _context.Users.Where(x => x.Id== idUser).ProjectTo<T>(_mapper.ConfigurationProvider).FirstOrDefaultAsync();
        return await Result<T>.SuccessAsync(user);
    }

    public async Task<Guid> CreateUser<T>(T request) where T : IUserCreateRequest
    {
        try
        {
            var user = _mapper.Map<User>(request);
            var normalizedPhone = PhoneHelper.NormalizePhone(user.Phone);
            var exists = await _context.Users
                .AnyAsync(x => x.Phone == user.Phone);

            if (exists)
            {
                throw new Exception("Пользователь с таким номером уже существует");
            }
            
            user.Status = UserStatus.Invited;
            user.Phone = normalizedPhone;
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return user.Id;
        }
        catch (DbUpdateException )
        {
            throw new Exception("Пользователь с таким номером уже существует");
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
        
    }
    
    public async Task<Result<None>> SetStatus (Guid idUser, UserStatus status)
    {
        try
        {
            var user = _context.Users.FirstOrDefault(x => x.Id == idUser);
            if (user == null)
            {
                return await Result<None>.FailureAsync("Пользователь не найден");
            }
            user.Status = status;
            await _context.SaveChangesAsync();
            return await Result<None>.SuccessAsync();
        }
        catch (DbUpdateException)
        {
            return await Result<None>.FailureAsync("Ошибка бд");
        }
        
    }

    public async Task<Result<None>> RemoveUser(Guid idUser)
    {
        var user = _context.Users.FirstOrDefault(x => x.Id == idUser);
        if (user == null)
        {
            return await Result<None>.SuccessAsync();
        }

        try
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return await Result<None>.SuccessAsync();
        }
        catch (Exception e)
        {
            return await Result<None>.FailureAsync(e.Message);
        }
    }
    
    public async Task<Dictionary<Guid, string>> GetUsersDictionary(List<Guid> ids)
    {
        if (ids == null || ids.Count == 0)
            return new Dictionary<Guid, string>();

        return await _context.Users
            .Where(x => ids.Contains(x.Id))
            .ToDictionaryAsync(x => x.Id, x => x.FullName);
    }
    
}