using System.Reflection;
using Auth.Application;
using Auth.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Auth.Extensions;

public static class ServiceCollectionExtension
{
    public static void AddAuthModule(this IServiceCollection services,IConfiguration configuration)
    {
        services.AddServices(configuration);
    }
    
    private static void AddServices(this IServiceCollection services, IConfiguration configuration)
    {
        
        services.AddScoped<IAuthService, AuthService>();
    }
}