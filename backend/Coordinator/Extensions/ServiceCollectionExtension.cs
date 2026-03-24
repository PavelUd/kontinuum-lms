using System.Reflection;
using Coordinator.interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Coordinator.Extensions;

public static class ServiceCollectionExtension
{
    public static void AddCoordinator(this IServiceCollection services,IConfiguration configuration)
    {
        var assembly = Assembly.GetAssembly(typeof(ICoordinator));
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(assembly);
//            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));
        });
    }
}