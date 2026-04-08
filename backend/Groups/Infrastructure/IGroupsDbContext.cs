using Groups.Domain;
using Microsoft.EntityFrameworkCore;

namespace Groups.Infrastructure;

public interface IGroupsDbContext
{
    public DbSet<Group> Groups { get; set; }
    
    public DbSet<GroupMember> GroupMembers { get; set; }
    
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken());
    int SaveChanges();
}