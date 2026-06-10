using Tracking.Application;
using Tracking.Domain;
using Tracking.Infrastructure;

namespace UnitTests.Tracking;

using Microsoft.EntityFrameworkCore;
using MockQueryable.Moq;
using Moq;
using Xunit;

public class BlockEngagementProcessorTests
{
    private readonly Mock<ITrackingDbContext> _contextMock = new();

    private BlockEngagementProcessor CreateProcessor()
    {
        return new BlockEngagementProcessor(_contextMock.Object);
    }

    private Mock<DbSet<BlockEngagement>> SetupBlockEngagements(List<BlockEngagement> engagements)
    {
        var dbSetMock = engagements
            .BuildMockDbSet();

        dbSetMock
            .Setup(x => x.Add(It.IsAny<BlockEngagement>()))
            .Callback<BlockEngagement>(engagements.Add);

        _contextMock
            .Setup(x => x.BlockEngagements)
            .Returns(dbSetMock.Object);

        _contextMock
            .Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        return dbSetMock;
    }

    [Fact]
    public async Task ProcessInternal_WhenStatsNotExists_ShouldCreateNewEngagement()
    {
        // Arrange
        var blockId = Guid.NewGuid();
        var lessonId = Guid.NewGuid();
        var timeSpentSeconds = 25.5;

        var engagements = new List<BlockEngagement>();

        SetupBlockEngagements(engagements);

        var processor = CreateProcessor();

        // Act
        await processor.ProcessInternal(blockId, lessonId, timeSpentSeconds);

        // Assert
        Assert.Single(engagements);

        var created = engagements.First();

        Assert.Equal(blockId, created.BlockId);
        Assert.Equal(lessonId, created.LessonId);
        Assert.Equal(1, created.ViewsCount);
        Assert.Equal(timeSpentSeconds, created.AvgTimeSpent);

        _contextMock.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once
        );
    }

    [Fact]
    public async Task ProcessInternal_WhenStatsExists_ShouldUpdateViewsCountAndAverageTime()
    {
        // Arrange
        var blockId = Guid.NewGuid();
        var lessonId = Guid.NewGuid();

        var existingStats = new BlockEngagement
        {
            BlockId = blockId,
            LessonId = lessonId,
            ViewsCount = 2,
            AvgTimeSpent = 30
        };

        var engagements = new List<BlockEngagement>
        {
            existingStats
        };

        SetupBlockEngagements(engagements);

        var processor = CreateProcessor();

        // Act
        await processor.ProcessInternal(blockId, lessonId, 60);

        // Assert
        Assert.Single(engagements);

        Assert.Equal(3, existingStats.ViewsCount);
        Assert.Equal(40, existingStats.AvgTimeSpent);

        _contextMock.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once
        );
    }

    [Fact]
    public async Task ProcessInternal_WhenStatsExists_ShouldNotCreateNewEntity()
    {
        // Arrange
        var blockId = Guid.NewGuid();
        var lessonId = Guid.NewGuid();

        var engagements = new List<BlockEngagement>
        {
            new()
            {
                BlockId = blockId,
                LessonId = lessonId,
                ViewsCount = 1,
                AvgTimeSpent = 10
            }
        };

        var dbSetMock = SetupBlockEngagements(engagements);

        var processor = CreateProcessor();

        // Act
        await processor.ProcessInternal(blockId, lessonId, 20);

        // Assert
        Assert.Single(engagements);

        dbSetMock.Verify(
            x => x.Add(It.IsAny<BlockEngagement>()),
            Times.Never
        );
    }
}