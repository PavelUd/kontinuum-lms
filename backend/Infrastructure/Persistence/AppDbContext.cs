using System.Reflection;
using Analytics.Domain;
using Analytics.Infrastructure;
using Auth.Domain;
using Auth.Infrastructure;
using BlockEngine.Domain.Entities;
using BlockEngine.Infrastructure;
using Courses.Application.Interfaces;
using Courses.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Tracking.Domain;
using Tracking.Infrastructure;
using Users.Domain;
using Users.Infrastructure;

namespace Infrastructure.Persistence;

public class AppDbContext : DbContext, ICoursesDbContext, ILessonBlockDbContext, IAuthDbContext , IUsersDbContext, ITrackingDbContext, IAnalyticsDbContext
{
    public DbSet<Course> Courses { get; set; }
    public DbSet<RefreshSession> RefreshSessions { get; set; }
    public DbSet<Lesson> Lessons { get; set; }
    public DbSet<User>  Users { get; set; }
    public DbSet<Credential> Credentials { get; set; }
    public DbSet<LessonBlock> LessonBlocks { get; set; }
    
    public DbSet<AnswerAttempt> AnswerAttempts { get; set; }
    
    public DbSet<BlockCompletion> BlockCompletions { get; set; }
    
    public DbSet<LessonProgress> LessonProgresses { get; set; }
    
    
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
        
    }
    
    public async Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        return await Database.BeginTransactionAsync(cancellationToken);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Course>()
            .HasMany(c => c.Lessons)
            .WithOne()
            .HasForeignKey(l => l.CourseId)
            .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<LessonBlock>()
            .Property(x => x.Type)
            .HasConversion<string>();
        
        modelBuilder.Entity<User>()
            .Property(x => x.Role)
            .HasConversion<string>();
        
        modelBuilder.Entity<User>()
            .Property(x => x.Status)
            .HasConversion<string>();
        
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<BlockCompletion>()
            .HasOne<LessonBlock>()
            .WithMany()
            .HasForeignKey(bc => bc.BlockId)
            .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<LessonBlock>()
            .HasOne<Lesson>()
            .WithMany()
            .HasForeignKey(bc => bc.LessonId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<LessonProgress>()
            .HasOne<Lesson>()
            .WithMany()
            .HasForeignKey(bc => bc.LessonId)
            .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}