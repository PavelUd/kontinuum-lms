using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Courses.Domain.Entities;
using Courses.Domain.Enums;
using Courses.DTO.Common;
using Courses.DTO.Lessons;
using FluentAssertions;
using Infrastructure.Persistence;
using IntegrationTests.Fixtures;
using IntegrationTests.Seed;
using Microsoft.Extensions.DependencyInjection;

namespace IntegrationTests.Courses;

public class LessonsTests : IClassFixture<IntegrationTestFactory>
{
    private readonly IntegrationTestFactory _factory;
    private readonly HttpClient _client;

    public LessonsTests(IntegrationTestFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetLessonById_ShouldReturnOk()
    {
        // Act
        var response = await _client.GetAsync($"/api/lessons/{TestDataSeeder.LessonId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();

        json.GetProperty("succeeded").GetBoolean().Should().BeTrue();
        json.GetProperty("data").Should().NotBeNull();
    }

    [Fact]
    public async Task GetLessons_ShouldReturnOk()
    {
        // Act
        var response = await _client.GetAsync($"/api/courses/{TestDataSeeder.CourseId}/lessons");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();

        json.GetProperty("succeeded").GetBoolean().Should().BeTrue();

        var data = json.GetProperty("data");

        data.ValueKind.Should().Be(JsonValueKind.Array);
        data.GetArrayLength().Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task GetAvailableLessons_ShouldReturnOk()
    {
        // Act
        var response = await _client.GetAsync($"/api/courses/{TestDataSeeder.CourseId}/available-lessons");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();

        json.GetProperty("succeeded").GetBoolean().Should().BeTrue();

        var data = json.GetProperty("data");

        data.ValueKind.Should().Be(JsonValueKind.Array);
        data.GetArrayLength().Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task PatchLesson_WithoutToken_ShouldReturnUnauthorized()
    {
        // Arrange
        var request = new PatchLessonRequest
        {
            Title = "Новое название урока"
        };

        // Act
        var response = await _client.PatchAsJsonAsync(
            $"/api/lessons/{TestDataSeeder.LessonId}",
            request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task PatchLesson_WithAdminToken_ShouldReturnNoContent()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TestJwtTokenProvider.GenerateAdminToken());

        var request = new PatchLessonRequest
        {
            Title = "Обновленное название урока"
        };

        // Act
        var response = await _client.PatchAsJsonAsync(
            $"/api/lessons/{TestDataSeeder.LessonId}",
            request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task SetStatus_WithoutToken_ShouldReturnUnauthorized()
    {
        // Arrange
        var request = new SetStatusRequest
        {
            Status = Status.Active
        };

        // Act
        var response = await _client.PostAsJsonAsync(
            $"/api/lessons/{TestDataSeeder.LessonId}/status",
            request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task SetStatus_WithAdminToken_ShouldReturnNoContent()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TestJwtTokenProvider.GenerateAdminToken());

        var request = new SetStatusRequest
        {
            Status = Status.Archived
        };

        // Act
        var response = await _client.PostAsJsonAsync(
            $"/api/lessons/{TestDataSeeder.LessonId}/status",
            request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task CreateLesson_ShouldReturnAccepted()
    {
        // Arrange
        var request = new LessonCreateRequest
        {
            Title = "Новый тестовый урок"
        };

        // Act
        var response = await _client.PostAsJsonAsync(
            $"/api/courses/{TestDataSeeder.CourseId}/lessons",
            request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Accepted);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();

        json.GetProperty("data").Should().NotBeNull();
    }

    [Fact]
    public async Task DeleteLesson_ShouldReturnAccepted()
    {
        // Arrange
        var lessonId = await CreateLessonForDeleteAsync();

        // Act
        var response = await _client.DeleteAsync($"/api/lessons/{lessonId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Accepted);
    }

    [Fact]
    public async Task PublishLesson_WithoutToken_ShouldReturnUnauthorized()
    {
        // Act
        var response = await _client.PostAsync(
            $"/api/lessons/{TestDataSeeder.DraftLessonId}/publish",
            null);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task PublishLesson_WithAdminToken_ShouldReturnNoContent()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TestJwtTokenProvider.GenerateAdminToken());

        // Act
        var response = await _client.PostAsync(
            $"/api/lessons/{TestDataSeeder.DraftLessonId}/publish",
            null);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task RollbackLesson_WithoutToken_ShouldReturnUnauthorized()
    {
        // Act
        var response = await _client.PostAsync(
            $"/api/lessons/{TestDataSeeder.DraftLessonId}/rollback",
            null);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task RollbackLesson_WithAdminToken_ShouldReturnNoContent()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TestJwtTokenProvider.GenerateAdminToken());

        // Act
        var response = await _client.PostAsync(
            $"/api/lessons/{TestDataSeeder.DraftLessonId}/rollback",
            null);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    private async Task<Guid> CreateLessonForDeleteAsync()
    {
        using var scope = _factory.Services.CreateScope();

        var dbContext = scope.ServiceProvider
            .GetRequiredService<AppDbContext>();

        var lessonId = Guid.NewGuid();

        var lesson = new Lesson
        {
            Id = lessonId,
            CourseId = TestDataSeeder.CourseId,
            Title = "Урок для удаления",
            Status = Status.Draft,
            OrderIndex = 100,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        await dbContext.Lessons.AddAsync(lesson);
        await dbContext.SaveChangesAsync();

        return lessonId;
    }
}