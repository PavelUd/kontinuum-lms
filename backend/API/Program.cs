using System.Text.Json;
using System.Text.Json.Serialization;
using BlockEngine.Application.Extensions;
using Courses.Extensions;
using Infrastructure.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddJsonOptions(o =>
{
    o.JsonSerializerOptions.Converters.Add(
        new JsonStringEnumConverter(JsonNamingPolicy.CamelCase)
    );
});;
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost3000",
        builder => builder.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

builder.Services.AddBlockEnginesModule(builder.Configuration);

builder.Services.AddInfrastructureModule(builder.Configuration);
builder.Services.AddCoursesModule(builder.Configuration);
var app = builder.Build();




app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AllowLocalhost3000");
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
