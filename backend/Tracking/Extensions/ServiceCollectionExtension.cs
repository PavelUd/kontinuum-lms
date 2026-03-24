using System.Reflection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Tracking.Application;
using Tracking.Application.Interface;

namespace Tracking.Extensions;

public static class ServiceCollectionExtension
{
    public static void AddTrackingModule(this IServiceCollection services,IConfiguration configuration)
    {
        services.AddScoped<ITrackingService, TrackingService>();
        services.AddAutoMapper(Assembly.GetExecutingAssembly());
    }
}