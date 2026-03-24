using System.Reflection;
using Contracts.Services;
using Courses.Application;
using Courses.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Courses.Extensions;

public static class ServiceCollectionExtension
{
    public static void AddCoursesModule(this IServiceCollection services,IConfiguration configuration)
    {
        services.AddServices(configuration);
    }
    
    private static void AddServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<ICoursesService, CoursesService>();
        services.AddScoped<ILessonsService, LessonsService>();
        services.AddScoped<ILessonProvider, LessonsService>();
        services.AddScoped<ICoursesProvider, CoursesService>();
        services.AddAutoMapper(Assembly.GetExecutingAssembly());
    }
}