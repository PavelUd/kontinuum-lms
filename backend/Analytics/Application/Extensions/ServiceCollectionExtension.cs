using System.Reflection;
using Analytics.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Analytics.Application.Extensions;

public static class ServiceCollectionExtension
{
    public static void AddAnalyticsModule(this IServiceCollection services,IConfiguration configuration)
    {
        services.AddScoped<IAnalyticsService, AnalyticsService>();
        services.AddScoped<ILessonContextProvider, LessonContextProvider>();
        services.AddScoped<IUserProgressService, UserProgressService>();
        services.AddAutoMapper(Assembly.GetExecutingAssembly());
    }
}