using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Tracking.Domain;

namespace Tracking.Infrastructure;

public interface ITrackingDbContext
{
    public DbSet<AnswerAttempt> AnswerAttempts { get; set; }
    public DbSet<BlockEngagement>  BlockEngagements { get; set; }
    
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken());
    int SaveChanges();
    
    Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default);
}