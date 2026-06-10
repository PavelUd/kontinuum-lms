using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Coordinator.User.Create;
using Core.Entities;
using FluentAssertions;
using Infrastructure.Persistence;
using IntegrationTests.Fixtures;
using IntegrationTests.Seed;
using Microsoft.Extensions.DependencyInjection;
using Users.Application.DTO;
using Users.Domain;

namespace IntegrationTests.Users;

public class StudentsTests : IClassFixture<IntegrationTestFactory>
{
    private readonly IntegrationTestFactory _factory;
    private readonly HttpClient _client;

    public StudentsTests(IntegrationTestFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetStudentsPage_WithoutToken_ShouldReturnUnauthorized()
    {
        // Act
        var response = await _client.GetAsync("/api/students?page=1&pageSize=10");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetStudentsPage_WithAdminToken_ShouldReturnOk()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TestJwtTokenProvider.GenerateAdminToken());

        // Act
        var response = await _client.GetAsync("/api/students?page=1&pageSize=10");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        
        json.GetProperty("items").Should().NotBeNull();
    }

    [Fact]
    public async Task CreateStudent_WithoutToken_ShouldReturnUnauthorized()
    {
        // Arrange
        var request = new CreateStudentCommand("Иван Иванов","+79990000003","student@gmail.com", 11);

        // Act
        var response = await _client.PostAsJsonAsync("/api/students", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task CreateStudent_WithAdminToken_ShouldReturnAccepted()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TestJwtTokenProvider.GenerateAdminToken());

        var request = new CreateStudentCommand("Иван Иванов","+79990000003","student@gmail.com", 11);

        // Act
        var response = await _client.PostAsJsonAsync("/api/students", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Accepted);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();

        json.GetProperty("succeeded").GetBoolean().Should().BeTrue();
    }

    [Fact]
    public async Task DeleteStudent_WithoutToken_ShouldReturnUnauthorized()
    {
        // Act
        var response = await _client.DeleteAsync($"/api/students/{TestDataSeeder.StudentId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task DeleteStudent_WithAdminToken_ShouldReturnAccepted()
    {
        // Arrange
        var studentId = await CreateStudentForDeleteAsync();

        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TestJwtTokenProvider.GenerateAdminToken());

        // Act
        var response = await _client.DeleteAsync($"/api/students/{studentId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Accepted);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();

        json.GetProperty("succeeded").GetBoolean().Should().BeTrue();
    }

    [Fact]
    public async Task SetStatus_WithoutToken_ShouldReturnUnauthorized()
    {
        // Arrange
        var request = new SetUserStatusRequest
        {
            Status = UserStatus.Blocked
        };

        // Act
        var response = await _client.PatchAsJsonAsync(
            $"/api/students/{TestDataSeeder.StudentId}/status",
            request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task SetStatus_WithAdminToken_ShouldReturnAccepted()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TestJwtTokenProvider.GenerateAdminToken());

        var request = new SetUserStatusRequest
        {
            Status = UserStatus.Blocked
        };

        // Act
        var response = await _client.PatchAsJsonAsync(
            $"/api/students/{TestDataSeeder.StudentId}/status",
            request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Accepted);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();

        json.GetProperty("succeeded").GetBoolean().Should().BeTrue();
    }

    private async Task<Guid> CreateStudentForDeleteAsync()
    {
        using var scope = _factory.Services.CreateScope();

        var dbContext = scope.ServiceProvider
            .GetRequiredService<AppDbContext>();

        var studentId = Guid.NewGuid();

        var student = new User
        {
            Id = studentId,
            FullName= "ForDelete",
            Email = "email@gmail.com",
            Phone = "+79990000999",
            Role = Role.Student,
            Status = UserStatus.Active,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        await dbContext.Users.AddAsync(student);
        await dbContext.SaveChangesAsync();

        return studentId;
    }
}