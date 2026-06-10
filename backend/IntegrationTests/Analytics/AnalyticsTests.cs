using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;
using IntegrationTests.Fixtures;
using IntegrationTests.Seed;

namespace IntegrationTests.Analytics;

public class AnalyticsTests  : IClassFixture<IntegrationTestFactory>
{
    private readonly HttpClient _client;

    public AnalyticsTests(IntegrationTestFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetCourseAnalytic_WithoutToken_ShouldReturnUnauthorized()
    {
        // Act
        var response = await _client.GetAsync(
            $"/api/analytic/progress/courses/{TestDataSeeder.CourseId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetCourseAnalytic_WithToken_ShouldReturnOk()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue(
                "Bearer",
                TestJwtTokenProvider.GenerateAdminToken());

        // Act
        var response = await _client.GetAsync(
            $"/api/analytic/progress/courses/{TestDataSeeder.CourseId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();

        json.ValueKind.Should().NotBe(JsonValueKind.Undefined);
    }

    [Fact]
    public async Task GetModuleAnalytic_WithoutToken_ShouldReturnUnauthorized()
    {
        // Act
        var response = await _client.GetAsync(
            $"/api/analytic/progress/courses/{TestDataSeeder.CourseId}/modules/{TestDataSeeder.LessonId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetModuleAnalytic_WithToken_ShouldReturnOk()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue(
                "Bearer",
                TestJwtTokenProvider.GenerateAdminToken());

        // Act
        var response = await _client.GetAsync(
            $"/api/analytic/progress/courses/{TestDataSeeder.CourseId}/modules/{TestDataSeeder.LessonId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();

        json.ValueKind.Should().NotBe(JsonValueKind.Undefined);
    }

    [Fact]
    public async Task GetGroupsAnalytic_WithoutToken_ShouldReturnUnauthorized()
    {
        // Act
        var response = await _client.GetAsync(
            $"/api/analytic/progress/groups?courseId={TestDataSeeder.CourseId}&moduleId={TestDataSeeder.LessonId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetGroupsAnalytic_WithToken_ShouldReturnOk()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue(
                "Bearer",
                TestJwtTokenProvider.GenerateAdminToken());

        // Act
        var response = await _client.GetAsync(
            $"/api/analytic/progress/groups?courseId={TestDataSeeder.CourseId}&moduleId={TestDataSeeder.LessonId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();

        json.ValueKind.Should().NotBe(JsonValueKind.Undefined);
    }

    [Fact]
    public async Task GetLessonEngagement_WithoutToken_ShouldReturnUnauthorized()
    {
        // Act
        var response = await _client.GetAsync(
            $"/api/analytic/lessons/{TestDataSeeder.LessonId}/engagement");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetLessonEngagement_WithToken_ShouldReturnOk()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue(
                "Bearer",
                TestJwtTokenProvider.GenerateAdminToken());

        // Act
        var response = await _client.GetAsync(
            $"/api/analytic/lessons/{TestDataSeeder.LessonId}/engagement");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();

        json.ValueKind.Should().Be(JsonValueKind.Array);
    }

    [Fact]
    public async Task GetGroupMembersAnalytic_WithoutToken_ShouldReturnUnauthorized()
    {
        // Act
        var response = await _client.GetAsync(
            $"/api/analytic/progress/groups/{TestDataSeeder.GroupId}/members?moduleId={TestDataSeeder.LessonId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetGroupMembersAnalytic_WithToken_ShouldReturnOk()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue(
                "Bearer",
                TestJwtTokenProvider.GenerateAdminToken());

        // Act
        var response = await _client.GetAsync(
            $"/api/analytic/progress/groups/{TestDataSeeder.GroupId}/members?moduleId={TestDataSeeder.LessonId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();

        json.ValueKind.Should().NotBe(JsonValueKind.Undefined);
    }
}