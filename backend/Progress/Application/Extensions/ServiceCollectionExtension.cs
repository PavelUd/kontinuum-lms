using System.Reflection;
using Analytics.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Analytics.Application.Extensions;

public static class ServiceCollectionExtension
{
    public static void AddAnalyticsModule(this IServiceCollection services,IConfiguration configuration)
    {
        services.AddScoped<ILessonProgressProcessor, LessonProgressProcessor>();
        services.AddScoped<ILessonContextProvider, LessonContextProvider>();
        services.AddScoped<IUserProgressService, UserProgressService>();
        services.AddScoped<IAnalyticProgressService, AnalyticProgressService>();
        services.AddAutoMapper(Assembly.GetExecutingAssembly());
    }
}