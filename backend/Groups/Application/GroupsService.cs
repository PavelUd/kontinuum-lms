using AutoMapper;
using AutoMapper.QueryableExtensions;
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

    public GroupsService(IGroupsDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
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

        var result = query
            .OrderByDescending(u => u.CreatedDate)
            .ProjectTo<GroupDto>(_mapper.ConfigurationProvider);

        return await result.ToPagedResultAsync(request.Page, request.PageSize, ct: ct);
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
            await _dbContext.SaveChangesAsync();

            return await Result<Guid>.SuccessAsync(group.Id);
        }

        catch (Exception e)
        {
            return await Result<Guid>.FailureAsync(e.Message);
        }
    } 
}