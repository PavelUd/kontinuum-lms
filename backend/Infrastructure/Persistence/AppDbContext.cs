using System.Reflection;
using Analytics.Domain;
using Analytics.Infrastructure;
using Auth.Domain;
using Auth.Infrastructure;
using BlockEngine.Domain.Entities;
using BlockEngine.Infrastructure;
using Coordinator.interfaces;
using Courses.Application.Interfaces;
using Courses.Domain.Entities;
using Courses.Infrastructure.Interfaces;
using Groups.Domain;
using Groups.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Tracking.Domain;
using Tracking.Infrastructure;
using Users.Domain;
using Users.Infrastructure;

namespace Infrastructure.Persistence;

public class AppDbContext : DbContext, ICoursesDbContext, ILessonBlockDbContext, IAuthDbContext , IUsersDbContext, ITrackingDbContext, IAnalyticsDbContext, IGroupsDbContext, ICoordinatorContext
{
    public DbSet<Course> Courses { get; set; }
    public DbSet<RefreshSession> RefreshSessions { get; set; }
    public DbSet<Lesson> Lessons { get; set; }
    public DbSet<User>  Users { get; set; }
    
    public DbSet<StudentProfile> StudentProfiles { get; set; }
    
    public DbSet<Credential> Credentials { get; set; }
    
    public DbSet<InviteLink> InviteLinks { get; set; }
    
    public DbSet<LessonBlock> LessonBlocks { get; set; }
    
    public DbSet<AnswerAttempt> AnswerAttempts { get; set; }
    
    public DbSet<BlockCompletion> BlockCompletions { get; set; }
    
    public DbSet<LessonProgress> LessonProgresses { get; set; }
    
    public DbSet<Group> Groups { get; set; }
    
    public DbSet<GroupMember> GroupMembers { get; set; }
    
    public DbSet<BlockEngagement>  BlockEngagements { get; set; }
    
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

        modelBuilder.Entity<Group>()
            .HasMany(g => g.Members)
            .WithOne(m => m.Group)
            .HasForeignKey(m => m.GroupId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Credential>()
            .HasOne<User>()
            .WithOne()
            .HasForeignKey<Credential>(bc => bc.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<InviteLink>()
            .HasOne<User>()
             .WithOne()
             .HasForeignKey<InviteLink>(bc => bc.UserId)
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

        modelBuilder.Entity<User>()
            .HasOne(x => x.StudentProfile)
            .WithOne(x => x.User)
            .HasForeignKey<StudentProfile>(x => x.UserId);

        modelBuilder.Entity<StudentProfile>()
            .HasKey(x => x.UserId);
        
        modelBuilder.Entity<GroupMember>()
            .Property(x => x.Role)
            .HasConversion<string>();
        
        
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
        
        modelBuilder.Entity<Group>()
            .HasOne<Course>()
            .WithMany()
            .HasForeignKey(bc => bc.CourseId)
            .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<GroupMember>()
            .HasOne<User>()
            .WithMany()
            .HasForeignKey(bc => bc.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}