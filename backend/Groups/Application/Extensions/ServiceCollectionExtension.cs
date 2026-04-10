using System.Reflection;
using Contracts.Services;
using Groups.Application;
using Groups.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Groups.Application.Extensions;

public static class ServiceCollectionExtension
{
    public static void AddGroupsModule(this IServiceCollection services,IConfiguration configuration)
    {
        services.AddServices(configuration);
    }
    
    private static void AddServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IGroupsService, GroupsService>();
        services.AddScoped<IGroupProvider, GroupsService>();
        services.AddScoped<IGroupMembersService, GroupMembersService>();
        services.AddAutoMapper(Assembly.GetExecutingAssembly());
    }
}