using System.Reflection;
using BlockEngine.Domain.Entities;
using BlockEngine.Infrastructure;
using Courses.Application.Interfaces;
using Courses.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class AppDbContext : DbContext, ICoursesDbContext, ILessonBlockDbContext
{
    public DbSet<Course> Courses { get; set; }
    public DbSet<Lesson> Lessons { get; set; }
    public DbSet<LessonBlock> LessonBLocks { get; set; }
    
    
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
        
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
        
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}