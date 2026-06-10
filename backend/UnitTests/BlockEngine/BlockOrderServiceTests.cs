using BlockEngine.Application.Services;
using BlockEngine.Domain.Entities;
using BlockEngine.Infrastructure;
using FluentAssertions;
using Moq;
using MockQueryable.Moq;

namespace UnitTests.BlockEngine;

public class BlockOrderServiceTests
{
    [Fact]
    public async Task MoveBlock_ShouldSetOrderIndexBetweenAboveAndBelow()
    {
        // Arrange
        var lessonId = Guid.NewGuid();

        var aboveBlock = new LessonBlock
        {
            Id = Guid.NewGuid(),
            LessonId = lessonId,
            OrderIndex = 10000
        };

        var targetBlock = new LessonBlock
        {
            Id = Guid.NewGuid(),
            LessonId = lessonId,
            OrderIndex = 50000
        };

        var belowBlock = new LessonBlock
        {
            Id = Guid.NewGuid(),
            LessonId = lessonId,
            OrderIndex = 30000
        };

        var blocks = new List<LessonBlock>
        {
            aboveBlock,
            targetBlock,
            belowBlock
        };

        var dbContextMock = CreateDbContextMock(blocks);

        var service = new BlockOrderService(dbContextMock.Object);

        // Act
        await service.MoveBlock(targetBlock, aboveBlock.Id, belowBlock.Id);

        // Assert
        targetBlock.OrderIndex.Should().Be(20000);

        dbContextMock.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task MoveBlock_WhenAboveIsNull_ShouldPlaceBlockBeforeBelow()
    {
        // Arrange
        var lessonId = Guid.NewGuid();

        var targetBlock = new LessonBlock
        {
            Id = Guid.NewGuid(),
            LessonId = lessonId,
            OrderIndex = 20000
        };

        var belowBlock = new LessonBlock
        {
            Id = Guid.NewGuid(),
            LessonId = lessonId,
            OrderIndex = 10000
        };

        var blocks = new List<LessonBlock>
        {
            belowBlock,
            targetBlock
        };

        var dbContextMock = CreateDbContextMock(blocks);

        var service = new BlockOrderService(dbContextMock.Object);

        // Act
        await service.MoveBlock(targetBlock, aboveId: null, belowId: belowBlock.Id);

        // Assert
        targetBlock.OrderIndex.Should().BeLessThan(belowBlock.OrderIndex);
        targetBlock.OrderIndex.Should().Be(0);

        dbContextMock.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task MoveBlock_WhenBelowIsNull_ShouldPlaceBlockAfterAbove()
    {
        // Arrange
        var lessonId = Guid.NewGuid();

        var aboveBlock = new LessonBlock
        {
            Id = Guid.NewGuid(),
            LessonId = lessonId,
            OrderIndex = 10000
        };

        var targetBlock = new LessonBlock
        {
            Id = Guid.NewGuid(),
            LessonId = lessonId,
            OrderIndex = 5000
        };

        var blocks = new List<LessonBlock>
        {
            aboveBlock,
            targetBlock
        };

        var dbContextMock = CreateDbContextMock(blocks);

        var service = new BlockOrderService(dbContextMock.Object);

        // Act
        await service.MoveBlock(targetBlock, aboveBlock.Id, belowId: null);

        // Assert
        targetBlock.OrderIndex.Should().BeGreaterThan(aboveBlock.OrderIndex);
        targetBlock.OrderIndex.Should().Be(20000);

        dbContextMock.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task MoveBlock_WhenAboveAndBelowAreNull_ShouldSetDefaultOrderIndex()
    {
        // Arrange
        var lessonId = Guid.NewGuid();

        var targetBlock = new LessonBlock
        {
            Id = Guid.NewGuid(),
            LessonId = lessonId,
            OrderIndex = 0
        };

        var blocks = new List<LessonBlock>
        {
            targetBlock
        };

        var dbContextMock = CreateDbContextMock(blocks);

        var service = new BlockOrderService(dbContextMock.Object);

        // Act
        await service.MoveBlock(targetBlock, aboveId: null, belowId: null);

        // Assert
        targetBlock.OrderIndex.Should().Be(10000);

        dbContextMock.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once);
    }

    private static Mock<ILessonBlockDbContext> CreateDbContextMock(
        List<LessonBlock> blocks)
    {
        var lessonBlocksDbSetMock = blocks.BuildMockDbSet();

        var dbContextMock = new Mock<ILessonBlockDbContext>();

        dbContextMock
            .Setup(x => x.LessonBlocks)
            .Returns(lessonBlocksDbSetMock.Object);

        dbContextMock
            .Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        return dbContextMock;
    }
}