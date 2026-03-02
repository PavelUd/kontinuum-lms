using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Courses.Infrastructure;

public class CoursesDbContextFactory 
    : BaseDesignTimeDbContextFactory<CoursesDbContext>
{
    protected override CoursesDbContext CreateNewInstance(
        DbContextOptions<CoursesDbContext> options)
    {
        return new CoursesDbContext(options);
    }
}