using System.Reflection;
using Courses.Application;
using Courses.Application.Interfaces;
using Courses.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Courses.Extensions;

public static class ServiceCollectionExtension
{
    public static void AddCoursesModule(this IServiceCollection services,IConfiguration configuration)
    {
        services.AddServices(configuration);
    }
    
    private static void AddServices(this IServiceCollection services, IConfiguration configuration)
    {
        AddDbContext(services, configuration);
        services.AddScoped<ICoursesDbContext, CoursesDbContext>();
        services.AddScoped<ICoursesService, CoursesService>();
        services.AddAutoMapper(Assembly.GetExecutingAssembly());
    }

    private static void AddDbContext(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("SqlConnection");

        services.AddDbContext<CoursesDbContext>(options =>
            options.UseNpgsql(connectionString ));
        
    }
}