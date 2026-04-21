using System.Reflection;
using Amazon.S3;
using Analytics.Infrastructure;
using Auth.Application.Interfaces;
using Auth.Infrastructure;
using BlockEngine.Application.Interfaces;
using BlockEngine.Infrastructure;
using Contracts.Services;
using Coordinator.interfaces;
using Courses.Application.Interfaces;
using Courses.Infrastructure.Interfaces;
using Groups.Infrastructure;
using Hangfire;
using Hangfire.PostgreSql;
using Infrastructure.Hashing;
using Infrastructure.ObjectStorage;
using Infrastructure.Persistence;
using Infrastructure.Sanitizers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Tracking.Infrastructure;
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
        services.AddScoped<ITrackingDbContext>(sp => sp.GetRequiredService<AppDbContext>());
        services.AddScoped<IAnalyticsDbContext>(sp => sp.GetRequiredService<AppDbContext>());
        services.AddScoped<IGroupsDbContext>(sp => sp.GetRequiredService<AppDbContext>());
        services.AddScoped<ICoordinatorContext>(sp => sp.GetRequiredService<AppDbContext>());
        
        services.AddHangfire(config =>
            config.UsePostgreSqlStorage(options =>
            {
                options.UseNpgsqlConnection(configuration.GetConnectionString("SqlConnection"));
            })
        );

        services.AddHangfireServer(options =>
        {
            options.WorkerCount = Environment.ProcessorCount * 2;
        });
        
        services.AddSingleton<IAmazonS3>(sp =>
        {
            var options = sp.GetRequiredService<IOptions<S3Options>>().Value;
            
            var config = new AmazonS3Config
            {
                ServiceURL = options.Endpoint,
                ForcePathStyle = true
            };

            return new AmazonS3Client(
                options.AccessKey,
                options.SecretKey,
                config);
        });
        
        services.AddScoped<IHashingService, HashingService>();
        services.AddScoped<IContentSanitizer, HtmlSanitizerService>();
        services.AddScoped<IStorageService, StorageService>();
    }

    private static void AddDbContext(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("SqlConnection");

        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString,
                b => b.MigrationsAssembly("Infrastructure")));
        
    }
}