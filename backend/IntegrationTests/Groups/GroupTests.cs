using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;
using Groups.Application.DTO;
using Groups.Domain;
using Infrastructure.Persistence;
using IntegrationTests.Fixtures;
using IntegrationTests.Seed;
using Microsoft.Extensions.DependencyInjection;

namespace IntegrationTests.Groups;

public class GroupsTests : IClassFixture<IntegrationTestFactory>
{
    private readonly IntegrationTestFactory _factory;
    private readonly HttpClient _client;

    public GroupsTests(IntegrationTestFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetGroupsPage_WithoutToken_ShouldReturnUnauthorized()
    {
        // Act
        var response = await _client.GetAsync("/api/groups?page=1&pageSize=10");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetGroupsPage_WithAdminToken_ShouldReturnOk()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TestJwtTokenProvider.GenerateAdminToken());

        // Act
        var response = await _client.GetAsync("/api/groups?page=1&pageSize=10");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();

        json.GetProperty("items").ValueKind.Should().Be(JsonValueKind.Array);
        json.GetProperty("items").GetArrayLength().Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task GetGroupById_ShouldReturnOk()
    {
        // Act
        var response = await _client.GetAsync($"/api/groups/{TestDataSeeder.GroupId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        json.Should().NotBeNull();
        json.GetProperty("id").GetGuid().Should().Be(TestDataSeeder.GroupId);
    }

    [Fact]
    public async Task GetAvailableLookupGroups_WithoutToken_ShouldReturnUnauthorized()
    {
        // Act
        var response = await _client.GetAsync(
            $"/api/groups/lookup/available?courseId={TestDataSeeder.CourseId}&userId={TestDataSeeder.StudentId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetAvailableLookupGroups_WithAdminToken_ShouldReturnOk()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TestJwtTokenProvider.GenerateAdminToken());

        // Act
        var response = await _client.GetAsync(
            $"/api/groups/lookup/available?courseId={TestDataSeeder.CourseId}&userId={TestDataSeeder.StudentId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();

        json.ValueKind.Should().Be(JsonValueKind.Array);
    }

    [Fact]
    public async Task CreateGroup_WithoutToken_ShouldReturnUnauthorized()
    {
        // Arrange
        var request = new GroupCreateRequest
        {
            Title = "Новая тестовая группа",
            CourseId = TestDataSeeder.CourseId,
            TeacherId = TestDataSeeder.EmployeeId
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/groups", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task CreateGroup_WithAdminToken_ShouldReturnAccepted()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TestJwtTokenProvider.GenerateAdminToken());

        var request = new GroupCreateRequest
        {
            Title = "Новая тестовая группа",
            CourseId = TestDataSeeder.CourseId,
            TeacherId = TestDataSeeder.EmployeeId
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/groups", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Accepted);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();

        json.GetProperty("succeeded").GetBoolean().Should().BeTrue();
    }

    [Fact]
    public async Task PatchGroup_WithoutToken_ShouldReturnUnauthorized()
    {
        // Arrange
        var request = new PatchGroupRequest
        {
            Title = "Обновленное название группы"
        };

        // Act
        var response = await _client.PatchAsJsonAsync(
            $"/api/groups/{TestDataSeeder.GroupId}",
            request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task PatchGroup_WithAdminToken_ShouldReturnOk()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TestJwtTokenProvider.GenerateAdminToken());

        var request = new PatchGroupRequest
        {
            Title = "Обновленное название группы"
        };

        // Act
        var response = await _client.PatchAsJsonAsync(
            $"/api/groups/{TestDataSeeder.GroupId}",
            request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();

        json.GetProperty("succeeded").GetBoolean().Should().BeTrue();
    }

    [Fact]
    public async Task DeleteGroup_WithoutToken_ShouldReturnUnauthorized()
    {
        // Act
        var response = await _client.DeleteAsync($"/api/groups/{TestDataSeeder.GroupId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task DeleteGroup_WithAdminToken_ShouldReturnAccepted()
    {
        // Arrange
        var groupId = await CreateGroupForDeleteAsync();

        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TestJwtTokenProvider.GenerateAdminToken());

        // Act
        var response = await _client.DeleteAsync($"/api/groups/{groupId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Accepted);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();

        json.GetProperty("succeeded").GetBoolean().Should().BeTrue();
    }

    private async Task<Guid> CreateGroupForDeleteAsync()
    {
        using var scope = _factory.Services.CreateScope();

        var dbContext = scope.ServiceProvider
            .GetRequiredService<AppDbContext>();

        var groupId = Guid.NewGuid();

        var group = new Group
        {
            Id = groupId,
            Title = "Группа для удаления",
            CourseId = TestDataSeeder.CourseId,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        await dbContext.Groups.AddAsync(group);
        await dbContext.SaveChangesAsync();

        return groupId;
    }
}