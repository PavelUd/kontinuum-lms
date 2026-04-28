using AutoMapper;
using AutoMapper.QueryableExtensions;
using Contracts.Services;
using Core;
using Core.Common.Extensions;
using Core.Common.Pagination;
using Groups.Application.DTO;
using Groups.Application.Interfaces;
using Groups.Domain;
using Groups.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Groups.Application;

public class GroupMembersService : IGroupMembersService, IGroupMembersProvider
{
    private  readonly IGroupsDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly IUserQueryService _userQueryService;

    public GroupMembersService(IGroupsDbContext dbContext, IMapper mapper, IUserQueryService userQueryService)
    {
        _dbContext = dbContext;
        _mapper = mapper;
        _userQueryService = userQueryService;
    }

    public async Task<PagedResult<GroupMemberDto>> GetGroupMembers(GetGroupMembersQuery request,Guid idGroup, CancellationToken ct)
    {
        var query = _dbContext.GroupMembers.Where(x => x.Role == GroupRole.Student)
            .AsNoTracking()
            .AsQueryable();

        query = query.Where(g => g.GroupId == idGroup);
        
        var items = query
            .OrderByDescending(u => u.JoinedAt)
            .ProjectTo<GroupMemberDto>(_mapper.ConfigurationProvider)
            .ToPagedResultAsync(request.Page, request.PageSize, ct: ct);
        
        var ids = items.Result.Items
            .Select(x => x.UserId)
            .Distinct()
            .ToList();
        
        var students = await _userQueryService.GetUsersDictionary(ids);
        foreach (var item in items.Result.Items)
        {
            if (students.TryGetValue(item.UserId, out var name))
                item.FullName = name;
        }
        return await items;
    }
    
    public async Task<Result<None>> DeleteGroupMember(Guid id, CancellationToken ct)
    {
        try
        {
            var member = await _dbContext.GroupMembers.FindAsync(id, ct);
            if (member == null || member.Role != GroupRole.Student)
            {
                return await Result<None>.SuccessAsync();
            }
            
            _dbContext.GroupMembers.Remove(member);
            await _dbContext.SaveChangesAsync(ct);

            return await Result<None>.SuccessAsync();
        }

        catch (Exception e)
        {
            return await Result<None>.FailureAsync(e.Message);
        }
    }
    
    public async Task<Result<None>> SetGroupTeacher(Guid idGroup, SetGroupTeacherRequest request)
    {
        try
        {
            var lesson = _dbContext.Groups.FirstOrDefault(x => x.Id == idGroup);
            if (lesson == null)
            {
                return await Result<None>.FailureAsync("Group not found");
            }

            var teacher = _dbContext.GroupMembers.FirstOrDefault(x => x.UserId == request.TeacherId && x.Role != GroupRole.Student);
            if (teacher != null)
            {
                teacher.UserId = request.TeacherId;
                teacher.JoinedAt  = DateTime.Now.ToUniversalTime();
                await _dbContext.SaveChangesAsync();
            }
            else
            {
                await CreateGroupMember(new CreateGroupMemberRequest()
                    { GroupId = idGroup, Role = GroupRole.Teacher, UserId = request.TeacherId });
            }

            return await Result<None>.SuccessAsync();
        }
        catch (Exception e)
        {
            return await Result<None>.FailureAsync(e.Message);
        }
    }

    public async Task<IReadOnlyList<Guid>> GetCourseStudentIds(Guid courseId, Guid? curatorId = null)
    {
        var groups = _dbContext.Groups
            .Where(g => g.CourseId == courseId);

        if (curatorId.HasValue)
        {
            groups = groups.Where(g =>
                g.Members.Any(m =>
                    m.UserId == curatorId.Value &&
                    m.Role != GroupRole.Student));
        }

        return await groups
            .SelectMany(g => g.Members)
            .Where(m => m.Role == GroupRole.Student)
            .Select(m => m.UserId)
            .Distinct()
            .ToListAsync();
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