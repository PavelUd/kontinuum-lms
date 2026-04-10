using AutoMapper;
using Core;
using Groups.Application.DTO;
using Groups.Application.Interfaces;
using Groups.Domain;
using Groups.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Groups.Application;

public class GroupMembersService : IGroupMembersService
{
    private  readonly IGroupsDbContext _dbContext;
    private readonly IMapper _mapper;

    public GroupMembersService(IGroupsDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<Result<Guid>> CreateGroupMember(CreateGroupMemberRequest request)
    {
        try
        {
            var group = _dbContext.Groups.Include(x => x.Members).FirstOrDefault(x => x.Id == request.GroupId);
            if(group == null)
            {
                return await Result<Guid>.FailureAsync("Группа не найдена");
            }

            if (group.Members.Select(x => x.UserId).Contains(request.UserId))
            {
                return await  Result<Guid>.FailureAsync("Пользователь уже добавлени в группу");
            }

            var member = _mapper.Map<GroupMember>(request);
            _dbContext.GroupMembers.Add(member);
            await _dbContext.SaveChangesAsync();
            return await Result<Guid>.SuccessAsync(member.Id);
        }
        catch (Exception e)
        {
            return await  Result<Guid>.FailureAsync($"Ошибка сохранения бд: {e.Message}");
        }
    }
}