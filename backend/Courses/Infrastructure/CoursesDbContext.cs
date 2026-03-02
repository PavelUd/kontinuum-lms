using System.Reflection;
using Courses.Application.Interfaces;
using Courses.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Courses.Infrastructure;

public class CoursesDbContext :  DbContext, ICoursesDbContext
{
    
    public DbSet<Course> Courses { get; set; }
    
    public CoursesDbContext(DbContextOptions<CoursesDbContext> options) : base(options)
    {
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        
        modelBuilder.Entity<Lesson>()
            .ToTable("lessons", t => t.ExcludeFromMigrations());
        
        modelBuilder.Entity<Lesson>().HasOne(l => l.Course)
               .WithMany(c => c.Lessons)
               .HasForeignKey(l => l.CourseId);
    }
}