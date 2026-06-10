using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using BlockEngine.Application.DTO;
using BlockEngine.Application.Plugins.Text;
using BlockEngine.Domain.Entities;
using BlockEngine.Domain.Enum;
using FluentAssertions;
using Infrastructure.Persistence;
using IntegrationTests.Fixtures;
using IntegrationTests.Seed;
using Microsoft.Extensions.DependencyInjection;

namespace IntegrationTests.Courses;

public class LessonBlocksTests  : IClassFixture<IntegrationTestFactory>
{
    private readonly HttpClient _client;
    private readonly IntegrationTestFactory _factory;

    public LessonBlocksTests(IntegrationTestFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetBlocks_WithoutToken_ShouldReturnUnauthorized()
    {
        // Act
        var response = await _client.GetAsync(
            $"/api/lessons/{TestDataSeeder.LessonId}/blocks");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetBlocks_WithToken_ShouldReturnOk()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue(
                "Bearer",
                TestJwtTokenProvider.GenerateAdminToken());

        // Act
        var response = await _client.GetAsync(
            $"/api/lessons/{TestDataSeeder.LessonId}/blocks");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();

        json.GetProperty("succeeded").GetBoolean().Should().BeTrue();

        var data = json.GetProperty("data");

        data.ValueKind.Should().Be(JsonValueKind.Array);
        data.GetArrayLength().Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task CreateBlock_WithoutToken_ShouldReturnUnauthorized()
    {
        // Arrange
        var request = new BlockCreateRequest
        {
            Type = BlockType.Text,
            Content = CreateJsonElement("""
            {
                "text": "Новый текстовый блок"
            }
            """)
        };

        // Act
        var response = await _client.PostAsJsonAsync(
            $"/api/lessons/{TestDataSeeder.DraftLessonId}/blocks",
            request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task CreateBlock_WithToken_ShouldReturnAccepted()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue(
                "Bearer",
                TestJwtTokenProvider.GenerateAdminToken());

        var request = new BlockCreateRequest
        {
            Type = BlockType.Text,
            Content = TextContent("Обновленный контент")
        };

        // Act
        var response = await _client.PostAsJsonAsync(
            $"/api/lessons/{TestDataSeeder.DraftLessonId}/blocks",
            request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Accepted);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();

        json.GetProperty("data").GetGuid().Should().NotBeEmpty();
    }

    [Fact]
    public async Task UpdateContent_WithoutToken_ShouldReturnUnauthorized()
    {
        // Arrange
        var request = new UpdateContentRequest
        {
            Content = TextContent("Обновленный контент")
        };

        // Act
        var response = await _client.PatchAsJsonAsync(
            $"/api/blocks/{TestDataSeeder.TextBlockId}/content",
            request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task UpdateContent_WithToken_ShouldReturnNoContent()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue(
                "Bearer",
                TestJwtTokenProvider.GenerateAdminToken());

        var request = new UpdateContentRequest
        {
            Content = TextContent("Обновленный контент")
        };

        // Act
        var response = await _client.PatchAsJsonAsync(
            $"/api/blocks/{TestDataSeeder.TextBlockId}/content",
            request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task MoveBlock_WithoutToken_ShouldReturnUnauthorized()
    {
        // Arrange
        var request = new MoveBlockRequest
        {
            AboveBlockId = null,
            BelowBlockId = TestDataSeeder.QuestionBlockId
        };

        // Act
        var response = await _client.PatchAsJsonAsync(
            $"/api/blocks/{TestDataSeeder.TextBlockId}/order-index",
            request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task MoveBlock_WithToken_ShouldReturnNoContent()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue(
                "Bearer",
                TestJwtTokenProvider.GenerateAdminToken());

        var request = new MoveBlockRequest
        {
            AboveBlockId = null,
            BelowBlockId = TestDataSeeder.QuestionBlockId
        };

        // Act
        var response = await _client.PatchAsJsonAsync(
            $"/api/blocks/{TestDataSeeder.TextBlockId}/order-index",
            request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task DeleteBlock_WithoutToken_ShouldReturnUnauthorized()
    {
        // Act
        var response = await _client.DeleteAsync(
            $"/api/blocks/{TestDataSeeder.TextBlockId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task DeleteBlock_WithToken_ShouldReturnNoContent()
    {
        // Arrange
        var blockId = await CreateBlockForDeleteAsync();

        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue(
                "Bearer",
                TestJwtTokenProvider.GenerateAdminToken());

        // Act
        var response = await _client.DeleteAsync(
            $"/api/blocks/{blockId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    private async Task<Guid> CreateBlockForDeleteAsync()
    {
        using var scope = _factory.Services.CreateScope();

        var dbContext = scope.ServiceProvider
            .GetRequiredService<AppDbContext>();

        var blockId = Guid.NewGuid();

        var block = new LessonBlock
        {
            Id = blockId,
            LessonId = TestDataSeeder.DraftLessonId,
            Type = BlockType.Text,
            OrderIndex = 100,
            Content = TextContent("Блок для удаления")
        };

        await dbContext.LessonBlocks.AddAsync(block);
        await dbContext.SaveChangesAsync();

        return blockId;
    }

    private static JsonElement CreateJsonElement(string json)
    {
        using var document = JsonDocument.Parse(json);
        return document.RootElement.Clone();
    }
    
    private static JsonElement TextContent(string text)
        {
            return JsonSerializer.SerializeToElement(new TextBlockContent
            {
                Text = text
            });
        }
}