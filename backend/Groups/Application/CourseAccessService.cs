using AutoMapper;
using Contracts.Services;
using Groups.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Groups.Application;

public class CourseAccessService : ICourseAccessService
{
    
    private  readonly IGroupsDbContext _dbContext;

    public CourseAccessService(IGroupsDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    public async Task<IReadOnlyList<Guid>> GetAccessibleCourseIds(Guid userId)
    {
        return await _dbContext.Groups
            .Where(g => g.Members.Any(m => m.UserId == userId))
            .Select(g => g.CourseId)
            .ToListAsync();
    }
}