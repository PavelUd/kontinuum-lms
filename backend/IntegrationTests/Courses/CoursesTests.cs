using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Core;
using Courses.DTO.Courses;
using FluentAssertions;
using IntegrationTests.Fixtures;

namespace IntegrationTests.Courses;

public class CoursesTests : IClassFixture<IntegrationTestFactory>
{
    private readonly HttpClient _client;

    public CoursesTests(IntegrationTestFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetCourses_ShouldReturnOk()
    {
        // Act
        var response = await _client.GetAsync("/api/courses");
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        options.Converters.Add(new JsonStringEnumConverter());
        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await response.Content.ReadFromJsonAsync<Result<List<SummaryCourseDto>>>(options);
        result.Should().NotBeNull();
        result!.Succeeded.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data.Should().HaveCount(1);
    }
}