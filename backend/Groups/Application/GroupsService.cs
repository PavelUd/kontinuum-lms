using AutoMapper;
using AutoMapper.QueryableExtensions;
using Contracts.Services;
using Core;
using Core.Common.Extensions;
using Core.Common.Pagination;
using Groups.Application.Interfaces;
using Groups.Domain;
using Groups.DTO;
using Groups.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Groups.Application;

public class GroupsService : IGroupsService
{
    
    private  readonly IGroupsDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly ICoursesProvider _coursesProvider;
    private readonly IUserQueryService _userQueryService;

    public GroupsService(IGroupsDbContext dbContext, IMapper mapper, ICoursesProvider coursesProvider, IUserQueryService userQueryService)
    {
        _dbContext = dbContext;
        _mapper = mapper;
        _coursesProvider = coursesProvider;
        _userQueryService = userQueryService;
    }
    
    public async Task<PagedResult<GroupDto>> GetGroups(GetGroupsQuery request, CancellationToken ct)
    {
        var query = _dbContext.Groups
            .AsNoTracking()
            .AsQueryable();
        
        if (request.CourseId.HasValue)
        {
            query = query.Where(g => g.CourseId == request.CourseId.Value);
        }
        
        if (request.TeacherId.HasValue)
        {
            query = query.Where(g =>
                g.Members.Any(m =>
                    m.UserId == request.TeacherId &&
                    m.Role == GroupRole.Teacher));
        }

        var items = query
            .OrderByDescending(u => u.CreatedDate)
            .ProjectTo<GroupDto>(_mapper.ConfigurationProvider)
            .ToPagedResultAsync(request.Page, request.PageSize, ct: ct);
        
        var courseIds = items.Result.Items
            .Select(x => x.CourseId)
            .Distinct()
            .ToList();

        var teacherIds = items.Result.Items
            .Where(x => x.TeacherId.HasValue)
            .Select(x => x.TeacherId!.Value)
            .Distinct()
            .ToList();
        
        var courses = await _coursesProvider.GetCourseDictionary(courseIds);
        var teachers = await _userQueryService.GetUsersDictionary(teacherIds);
        foreach (var item in items.Result.Items)
        {
            if (courses.TryGetValue(item.CourseId, out var courseName))
                item.CourseName = courseName;

            if (item.TeacherId.HasValue &&
                teachers.TryGetValue(item.TeacherId.Value, out var teacherName))
                item.TeacherName = teacherName;
        }
        return await items;
    }

    
    public async Task<Result<None>> DeleteGroup(Guid id, CancellationToken ct)
    {
        try
        {
            var group =  await _dbContext.Groups.FindAsync(id, ct);
            if (group == null)
            {
                return await Result<None>.SuccessAsync();
            }
            
            _dbContext.Groups.Remove(group);
            await _dbContext.SaveChangesAsync(ct);

            return await Result<None>.SuccessAsync();
        }

        catch (Exception e)
        {
            return await Result<None>.FailureAsync(e.Message);
        }
    }
    
    public async Task<Result<Guid>> CreateGroup(GroupCreateRequest request)
    {
        try
        {
            var group = _mapper.Map<Group>(request);
            _dbContext.Groups.Add(group);
            _dbContext.GroupMembers.Add(new GroupMember()
            {
                GroupId = group.Id,
                UserId = request.TeacherId,
                Role = GroupRole.Teacher
            });
            await _dbContext.SaveChangesAsync();

            return await Result<Guid>.SuccessAsync(group.Id);
        }

        catch (Exception e)
        {
            return await Result<Guid>.FailureAsync(e.Message);
        }
    } 
}