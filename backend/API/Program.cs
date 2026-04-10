using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Analytics.Application.Extensions;
using Auth.Domain;
using Auth.Extensions;
using BlockEngine.Application.Extensions;
using Coordinator.Extensions;
using Core.Entities.Interfaces;
using Courses.Extensions;
using Groups.Application.Extensions;
using Hangfire;
using Infrastructure.Extensions;
using Infrastructure.ObjectStorage;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Scalar.AspNetCore;
using Tracking.Extensions;
using Users.Application.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddJsonOptions(o =>
{
    o.JsonSerializerOptions.Converters.Add(
        new JsonStringEnumConverter(JsonNamingPolicy.CamelCase)
    );
});

builder.Services.AddAuthentication(x =>
    {
        x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(x =>
    {
        x.RequireHttpsMetadata = false;
        x.SaveToken = true;
        x.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration["token:secret"])),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Kontinumm LMS API",
        Description = "API Образовательной платформы"
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Введите строку авторизации: Bearer {token}",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    options.AddSecurityRequirement(document => new() { [new OpenApiSecuritySchemeReference("Bearer", document)] = [] });

    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost3000",
        builder => builder.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

builder.Services.AddBlockEnginesModule(builder.Configuration);

builder.Services.Configure<Token>(builder.Configuration.GetSection("token"));
builder.Services.Configure<S3Options>(builder.Configuration.GetSection("S3"));
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IIdentityUser, IdentityUser>();

builder.Services.AddInfrastructureModule(builder.Configuration);
builder.Services.AddUsersModule(builder.Configuration);
builder.Services.AddCoursesModule(builder.Configuration);
builder.Services.AddAuthModule(builder.Configuration);
builder.Services.AddTrackingModule(builder.Configuration);
builder.Services.AddAnalyticsModule(builder.Configuration);
builder.Services.AddGroupsModule(builder.Configuration);
builder.Services.AddCoordinator(builder.Configuration);

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.MapScalarApiReference(options =>
{
    options.WithOpenApiRoutePattern("/swagger/{documentName}/swagger.json");
});
app.UseCors("AllowLocalhost3000");
app.UseHangfireDashboard("/hangfire", new DashboardOptions
{
    
});
app.UseAuthentication();
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
