using System.Reflection;
using BlockEngine.Application.Interfaces;
using BlockEngine.Application.Plugins.Heading;
using BlockEngine.Application.Plugins.Text;
using BlockEngine.Application.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace BlockEngine.Application.Extensions;

public static class ServiceCollectionExtension
{
    public static void AddBlockEnginesModule(this IServiceCollection services,IConfiguration configuration)
    {
        services.AddServices(configuration);
    }
    
    private static void AddServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<BlockRegistry>();
        services.AddScoped<Services.BlockEngine>();
        services.AddScoped<IBlockService, BlockService>();
        services.AddScoped<IBlockPlugin, TextBlockPlugin>();
        services.AddScoped<IBlockPlugin, HeadingBlockPlugin>();
        services.AddAutoMapper(Assembly.GetExecutingAssembly());
        
        
        var assembly = Assembly.GetAssembly(typeof(IApplicationMarker));
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(assembly);

        });
        
    }
}