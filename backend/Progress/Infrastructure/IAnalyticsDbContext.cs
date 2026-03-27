using Analytics.Domain;
using Microsoft.EntityFrameworkCore;

namespace Analytics.Infrastructure;

public interface IAnalyticsDbContext
{
    public DbSet<BlockCompletion> BlockCompletions { get; set; }
    
    public DbSet<LessonProgress> LessonProgresses { get; set; }
    
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken());
    
    int SaveChanges();
}