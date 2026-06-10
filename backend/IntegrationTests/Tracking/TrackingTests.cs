using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Coordinator.Activities.CompleteBlock;
using Coordinator.Activities.Engagement;
using FluentAssertions;
using IntegrationTests.Fixtures;
using IntegrationTests.Seed;

namespace IntegrationTests.Tracking;

public class TrackingTests : IClassFixture<IntegrationTestFactory>
{
    private readonly HttpClient _client;

    public TrackingTests(IntegrationTestFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task TrackEngagement_WithoutToken_ShouldReturnUnauthorized()
    {
        // Arrange
        var request = new List<BlockEngagementRequest>(){new (TestDataSeeder.TextBlockId, TestDataSeeder.LessonId, 5000)};

        // Act
        var response = await _client.PostAsJsonAsync(
            "/api/tracking/engagement",
            request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task TrackEngagement_WithToken_ShouldReturnOk()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue(
                "Bearer",
                TestJwtTokenProvider.GenerateStudentToken());

        var request = new List<BlockEngagementRequest>
        {
            new (TestDataSeeder.TextBlockId, TestDataSeeder.LessonId, 5000)
        };

        // Act
        var response = await _client.PostAsJsonAsync(
            "/api/tracking/engagement",
            request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task CompleteBlocks_WithoutToken_ShouldReturnUnauthorized()
    {
        // Arrange
        var request = new List<CompleteBlockRequest>
        {
            new(TestDataSeeder.TextBlockId, TextContent("hello"))
        };

        // Act
        var response = await _client.PostAsJsonAsync(
            "/api/progress/complete-blocks",
            request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task CompleteBlocks_WithToken_ShouldReturnOkAndCompletedBlockIds()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue(
                "Bearer",
                TestJwtTokenProvider.GenerateStudentToken());

        var request = new List<CompleteBlockRequest>
        {
            new(TestDataSeeder.TextBlockId, TextContent("hello"))
        };

        // Act
        var response = await _client.PostAsJsonAsync(
            "/api/progress/complete-blocks",
            request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();

        json.ValueKind.Should().Be(JsonValueKind.Array);
        json.GetArrayLength().Should().BeGreaterThan(0);

        json.EnumerateArray()
            .Should()
            .Contain(x => x.GetGuid() == TestDataSeeder.TextBlockId);
    }
    
    private static JsonElement TextContent(string text)
    {
        return JsonSerializer.SerializeToElement(text);
    }
}