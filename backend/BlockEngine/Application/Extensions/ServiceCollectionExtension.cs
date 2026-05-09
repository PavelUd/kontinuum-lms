using System.Reflection;
using BlockEngine.Application.Interfaces;
using BlockEngine.Application.Plugins.Callout;
using BlockEngine.Application.Plugins.Formula;
using BlockEngine.Application.Plugins.Heading;
using BlockEngine.Application.Plugins.Spoiler;
using BlockEngine.Application.Plugins.Text;
using BlockEngine.Application.Services;
using Contracts.Services;
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
        services.AddScoped<IBlockOrderService, BlockOrderService>();
        services.AddScoped<IBlockFileService, BlockFileService>();
        services.AddScoped<IBlockService, BlockService>();
        services.AddScoped<ILessonBlockStatsProvider, BlockService>();
        services.AddScoped<IBlockSynchronizer, BlockSynchronizer>();
        services.AddScoped<IBlockEvaluationService, BlockEvaluationService>();
        
        services.Scan(scan => scan
            .FromAssemblyOf<IBlockPlugin>()
            .AddClasses(classes => classes.AssignableTo<IBlockPlugin>())
            .As<IBlockPlugin>()
            .WithScopedLifetime());
        
        services.AddAutoMapper(Assembly.GetExecutingAssembly());
        
        
        var assembly = Assembly.GetAssembly(typeof(IApplicationMarker));
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(assembly);

        });
        
    }
}