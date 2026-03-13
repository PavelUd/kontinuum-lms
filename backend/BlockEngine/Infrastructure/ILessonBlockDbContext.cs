using BlockEngine.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BlockEngine.Infrastructure;

public interface ILessonBlockDbContext
{
    public DbSet<LessonBlock> LessonBlocks { get; set; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken());
    int SaveChanges();
}