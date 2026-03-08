using System.Reflection;
using Auth.Application.Interfaces;
using Auth.Infrastructure;
using BlockEngine.Infrastructure;
using Courses.Application.Interfaces;
using Infrastructure.Hashing;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Users.Infrastructure;

namespace Infrastructure.Extensions;

public static class ServiceCollectionExtension
{
    public static void AddInfrastructureModule(this IServiceCollection services,IConfiguration configuration)
    {
        services.AddServices(configuration);
    }
    
    private static void AddServices(this IServiceCollection services, IConfiguration configuration)
    {
        AddDbContext(services, configuration);
        services.AddScoped<ICoursesDbContext>(sp => sp.GetRequiredService<AppDbContext>());
        services.AddScoped<ILessonBlockDbContext>(sp => sp.GetRequiredService<AppDbContext>());
        services.AddScoped<IAuthDbContext>(sp => sp.GetRequiredService<AppDbContext>());
        services.AddScoped<IUsersDbContext>(sp => sp.GetRequiredService<AppDbContext>());
        services.AddScoped<IHashingService, HashingService>();
    }

    private static void AddDbContext(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("SqlConnection");

        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString ));
        
    }
}