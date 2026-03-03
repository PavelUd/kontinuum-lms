using Courses.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Courses.Application.Interfaces;

public interface ICoursesDbContext
{
    public DbSet<Course> Courses { get; set; }
    public DbSet<Lesson> Lessons { get; set; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken());
    int SaveChanges();
}