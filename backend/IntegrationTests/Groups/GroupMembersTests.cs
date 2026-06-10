using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Core.Entities;
using FluentAssertions;
using Groups.Application.DTO;
using Groups.Domain;
using Infrastructure.Persistence;
using IntegrationTests.Fixtures;
using IntegrationTests.Seed;
using Microsoft.Extensions.DependencyInjection;
using Users.Domain;

namespace IntegrationTests.Groups;

public class GroupMembersTests : IClassFixture<IntegrationTestFactory>
{
    private readonly IntegrationTestFactory _factory;
    private readonly HttpClient _client;

    public GroupMembersTests(IntegrationTestFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetGroupMembers_WithoutToken_ShouldReturnUnauthorized()
    {
        // Act
        var response = await _client.GetAsync(
            $"/api/groups/{TestDataSeeder.GroupId}/members?page=1&pageSize=10");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetGroupMembers_WithAdminToken_ShouldReturnOk()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TestJwtTokenProvider.GenerateAdminToken());

        // Act
        var response = await _client.GetAsync(
            $"/api/groups/{TestDataSeeder.GroupId}/members?page=1&pageSize=10");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();

        json.GetProperty("items").ValueKind.Should().Be(JsonValueKind.Array);
        json.GetProperty("items").GetArrayLength().Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task AddGroupMember_WithoutToken_ShouldReturnUnauthorized()
    {
        // Arrange
        var request = new CreateGroupMemberRequest
        {
            UserId = TestDataSeeder.StudentId
        };

        // Act
        var response = await _client.PostAsJsonAsync(
            $"/api/groups/{TestDataSeeder.GroupId}/members",
            request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task AddGroupMember_WithAdminToken_ShouldReturnAccepted()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TestJwtTokenProvider.GenerateAdminToken());

        var studentId = await CreateStudentForAddAsync();

        var request = new CreateGroupMemberRequest
        {
            UserId = studentId
        };

        // Act
        var response = await _client.PostAsJsonAsync(
            $"/api/groups/{TestDataSeeder.GroupId}/members",
            request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Accepted);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();

        json.GetProperty("succeeded").GetBoolean().Should().BeTrue();
    }

    [Fact]
    public async Task SetGroupCurator_WithoutToken_ShouldReturnUnauthorized()
    {
        // Arrange
        var request = new SetGroupTeacherRequest
        {
            TeacherId = TestDataSeeder.EmployeeId
        };

        // Act
        var response = await _client.PatchAsJsonAsync(
            $"/api/groups/{TestDataSeeder.GroupId}/members/curator/{TestDataSeeder.GroupMemberId}",
            request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task SetGroupCurator_WithAdminToken_ShouldReturnOk()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TestJwtTokenProvider.GenerateAdminToken());

        var request = new SetGroupTeacherRequest
        {
            TeacherId = TestDataSeeder.EmployeeId
        };

        // Act
        var response = await _client.PatchAsJsonAsync(
            $"/api/groups/{TestDataSeeder.GroupId}/members/curator/{TestDataSeeder.GroupMemberId}",
            request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();

        json.GetProperty("succeeded").GetBoolean().Should().BeTrue();
    }

    [Fact]
    public async Task DeleteGroupMember_WithoutToken_ShouldReturnUnauthorized()
    {
        // Act
        var response = await _client.DeleteAsync(
            $"/api/groups/{TestDataSeeder.GroupId}/members/{TestDataSeeder.GroupMemberId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task DeleteGroupMember_WithAdminToken_ShouldReturnAccepted()
    {
        // Arrange
        var memberId = await CreateGroupMemberForDeleteAsync();

        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TestJwtTokenProvider.GenerateAdminToken());

        // Act
        var response = await _client.DeleteAsync(
            $"/api/groups/{TestDataSeeder.GroupId}/members/{memberId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Accepted);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();

        json.GetProperty("succeeded").GetBoolean().Should().BeTrue();
    }

    private async Task<Guid> CreateStudentForAddAsync()
    {
        using var scope = _factory.Services.CreateScope();

        var dbContext = scope.ServiceProvider
            .GetRequiredService<AppDbContext>();

        var studentId = Guid.NewGuid();

        var student = new User
        {
            Id = studentId,
            FullName = "Student ForAdd",
            Email = "st@gmail.com",
            Phone = $"+7999{Random.Shared.Next(1000000, 9999999)}",
            Role = Role.Student,
            Status = UserStatus.Active,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        await dbContext.Users.AddAsync(student);
        await dbContext.SaveChangesAsync();

        return studentId;
    }

    private async Task<Guid> CreateGroupMemberForDeleteAsync()
    {
        using var scope = _factory.Services.CreateScope();

        var dbContext = scope.ServiceProvider
            .GetRequiredService<AppDbContext>();

        var studentId = Guid.NewGuid();
        var memberId = Guid.NewGuid();

        var student = new User
        {
            Id = studentId,
            FullName = "Student ForDelete",
            Email = "del@gmail.com",
            Phone = $"+7998{Random.Shared.Next(1000000, 9999999)}",
            Role = Role.Student,
            Status = UserStatus.Active,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        var member = new GroupMember
        {
            Id = memberId,
            GroupId = TestDataSeeder.GroupId,
            UserId = studentId,
            Role = GroupRole.Student,
            JoinedAt = DateTime.UtcNow
        };

        await dbContext.Users.AddAsync(student);
        await dbContext.GroupMembers.AddAsync(member);
        await dbContext.SaveChangesAsync();

        return memberId;
    }
}