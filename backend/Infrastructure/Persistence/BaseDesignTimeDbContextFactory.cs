using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Infrastructure.Persistence;

public abstract class BaseDesignTimeDbContextFactory<TContext> 
    : IDesignTimeDbContextFactory<TContext>
    where TContext : DbContext
{
    public TContext CreateDbContext(string[] args)
    {
        var connectionString = GetConnectionString();

        var optionsBuilder = new DbContextOptionsBuilder<TContext>();
        optionsBuilder.UseNpgsql(connectionString);

        return CreateNewInstance(optionsBuilder.Options);
    }

    protected virtual string GetConnectionString()
    {
        return "Host=localhost;Port=5432;Database=kontinuum_lms;Username=postgres;Password=root";
    }

    protected abstract TContext CreateNewInstance(
        DbContextOptions<TContext> options);
}