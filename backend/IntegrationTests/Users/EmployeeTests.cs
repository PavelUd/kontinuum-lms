using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;
using IntegrationTests.Fixtures;
using IntegrationTests.Seed;

namespace IntegrationTests.Users;

public class EmployeeTests : IClassFixture<IntegrationTestFactory>
{
    private readonly HttpClient _client;

    public EmployeeTests(IntegrationTestFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetEmployeesPage_ShouldReturnOk()
    {
        // Act
        var response = await _client.GetAsync("/api/employees?page=1&pageSize=10");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        
        json.GetProperty("items").Should().NotBeNull();
    }

    [Fact]
    public async Task GetEmployeesLookup_WithoutToken_ShouldReturnUnauthorized()
    {
        // Act
        var response = await _client.GetAsync("/api/employees/lookup");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetEmployeesLookup_WithAdminToken_ShouldReturnOk()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TestJwtTokenProvider.GenerateAdminToken());

        // Act
        var response = await _client.GetAsync("/api/employees/lookup");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();

        json.ValueKind.Should().Be(JsonValueKind.Array);
        json.GetArrayLength().Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task DeleteEmployee_WithoutToken_ShouldReturnUnauthorized()
    {
        // Act
        var response = await _client.DeleteAsync($"/api/employees/{TestDataSeeder.EmployeeId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task DeleteEmployee_WithAdminToken_ShouldReturnAccepted()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TestJwtTokenProvider.GenerateAdminToken());

        // Act
        var response = await _client.DeleteAsync($"/api/employees/{TestDataSeeder.EmployeeId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Accepted);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();

        json.GetProperty("succeeded").GetBoolean().Should().BeTrue();
    }
}