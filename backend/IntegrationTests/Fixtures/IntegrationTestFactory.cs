using Amazon.S3;
using Infrastructure.Persistence;
using IntegrationTests.Seed;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Moq;
using Testcontainers.PostgreSql;


namespace IntegrationTests.Fixtures;

public sealed class IntegrationTestFactory 
    : WebApplicationFactory<Program>, IAsyncLifetime
{
    public const string TokenSecret = "super-secret-test-key-super-secret-test-key";

    private readonly PostgreSqlContainer _postgres = new PostgreSqlBuilder()
        .WithImage("postgres:16")
        .WithDatabase("app_integration_tests")
        .WithUsername("postgres")
        .WithPassword("postgres")
        .Build();

    public async Task InitializeAsync()
    {
        await _postgres.StartAsync();

        using var scope = Services.CreateScope();

        var dbContext = scope.ServiceProvider
            .GetRequiredService<AppDbContext>();

        await dbContext.Database.MigrateAsync();

        await TestDataSeeder.SeedAsync(dbContext);
    }

    public new async Task DisposeAsync()
    {
        await _postgres.DisposeAsync();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("IntegrationTests");

        builder.ConfigureAppConfiguration((context, config) =>
        {
            var testJwtSettings = new Dictionary<string, string?>
            {
                ["token:secret"] = TokenSecret
            };

            config.AddInMemoryCollection(testJwtSettings);
        });

        builder.ConfigureServices(services =>
        {
            var dbContextDescriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));

            if (dbContextDescriptor is not null)
                services.Remove(dbContextDescriptor);

            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseNpgsql(_postgres.GetConnectionString());
            });
            services.RemoveAll<IAmazonS3>();
            services.AddSingleton(new Mock<IAmazonS3>().Object);
        });
    }
}