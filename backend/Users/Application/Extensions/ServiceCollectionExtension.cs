using System.Reflection;
using Contracts.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Users.Application.Interfaces;

namespace Users.Application.Extensions;

public static class ServiceCollectionExtension
{
    public static void AddUsersModule(this IServiceCollection services,IConfiguration configuration)
    {
        services.AddScoped<IUsersService, UsersService>();
        services.AddScoped<IEmployeeService, EmployeeService>();
        services.AddScoped<IStudentService, StudentService>();
        services.AddScoped<IUserQueryService, UsersService>();
        services.AddAutoMapper(Assembly.GetExecutingAssembly());
    }
}