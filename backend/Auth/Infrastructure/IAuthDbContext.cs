using Auth.Domain;
using Microsoft.EntityFrameworkCore;

namespace Auth.Infrastructure;

public interface IAuthDbContext
{
    public DbSet<Credential> Credentials { get; set; }
    
    public DbSet<InviteLink> InviteLinks { get; set; }
    public DbSet<RefreshSession> RefreshSessions { get; set; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken());
    
    int SaveChanges();
}