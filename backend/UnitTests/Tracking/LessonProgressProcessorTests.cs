using Analytics.Application;
using Analytics.Application.DTO;
using Analytics.Application.Interfaces;
using Analytics.Domain;
using Analytics.Infrastructure;
using Contracts.Contracts.StatsEvents;

namespace UnitTests.Tracking;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using MockQueryable.Moq;
using Moq;
using Xunit;

public class LessonProgressProcessorTests
{
    private readonly Mock<ILessonContextProvider> _lessonContextProviderMock = new();
    private readonly Mock<IAnalyticsDbContext> _analyticsDbContextMock = new();

    private readonly List<BlockCompletion> _addedBlockCompletions = new();
    private readonly List<LessonProgress> _addedLessonProgresses = new();

    public LessonProgressProcessorTests()
    {
        _analyticsDbContextMock
            .Setup(x => x.SaveChangesAsync())
            .ReturnsAsync(1);
    }

    private LessonProgressProcessor CreateProcessor()
    {
        return new LessonProgressProcessor(
            _lessonContextProviderMock.Object,
            _analyticsDbContextMock.Object
        );
    }

    private void SetupBlockCompletions(List<BlockCompletion> completions)
    {
        var dbSetMock = completions
            .BuildMockDbSet();

        dbSetMock
            .Setup(x => x.Add(It.IsAny<BlockCompletion>()))
            .Callback<BlockCompletion>(x => _addedBlockCompletions.Add(x))
            .Returns((EntityEntry<BlockCompletion>)null!);

        _analyticsDbContextMock
            .Setup(x => x.BlockCompletions)
            .Returns(dbSetMock.Object);
    }

    private void SetupLessonProgresses(List<LessonProgress> progresses)
    {
        var dbSetMock = progresses
            .BuildMockDbSet();

        dbSetMock
            .Setup(x => x.Add(It.IsAny<LessonProgress>()))
            .Callback<LessonProgress>(x => _addedLessonProgresses.Add(x))
            .Returns((EntityEntry<LessonProgress>)null!);

        _analyticsDbContextMock
            .Setup(x => x.LessonProgresses)
            .Returns(dbSetMock.Object);
    }

    private void SetupLessonContext(Guid lessonId, Guid courseId, int totalBlocks)
    {
        _lessonContextProviderMock
            .Setup(x => x.GetAsync(lessonId))
            .ReturnsAsync(new LessonContextDto
            {
                LessonId = lessonId,
                CourseId = courseId,
                TotalBlocks = totalBlocks
            });
    }

    [Fact]
    public async Task ProcessInternal_WhenBlockAlreadyCompleted_ShouldDoNothing()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var lessonId = Guid.NewGuid();
        var blockId = Guid.NewGuid();

        SetupBlockCompletions(new List<BlockCompletion>
        {
            new()
            {
                UserId = userId,
                LessonId = lessonId,
                BlockId = blockId,
                AffectsScore = true
            }
        });

        SetupLessonProgresses(new List<LessonProgress>
        {
            new()
            {
                UserId = userId,
                LessonId = lessonId,
                Progress = 50,
                Score = 1
            }
        });

        var processor = CreateProcessor();

        var @event = new BlockEvaluatedEvent
        {
            UserId = userId,
            LessonId = lessonId,
            BlockId = blockId,
            AffectsScore = true
        };

        // Act
        await processor.ProcessInternal(@event);

        // Assert
        Assert.Empty(_addedBlockCompletions);
        Assert.Empty(_addedLessonProgresses);

        _analyticsDbContextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Never
        );
    }

    [Fact]
    public async Task ProcessInternal_WhenLessonProgressNotExists_ShouldCreateProgressAndCompletion()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var courseId = Guid.NewGuid();
        var lessonId = Guid.NewGuid();
        var blockId = Guid.NewGuid();

        SetupBlockCompletions(new List<BlockCompletion>());
        SetupLessonProgresses(new List<LessonProgress>());

        SetupLessonContext(lessonId, courseId, totalBlocks: 4);

        var processor = CreateProcessor();

        var @event = new BlockEvaluatedEvent
        {
            UserId = userId,
            LessonId = lessonId,
            BlockId = blockId,
            AffectsScore = true
        };

        // Act
        await processor.ProcessInternal(@event);

        // Assert
        Assert.Single(_addedLessonProgresses);
        Assert.Single(_addedBlockCompletions);

        var progress = _addedLessonProgresses.First();

        Assert.Equal(userId, progress.UserId);
        Assert.Equal(courseId, progress.CourseId);
        Assert.Equal(lessonId, progress.LessonId);
        Assert.Equal(25, progress.Progress);
        Assert.Equal(1, progress.Score);

        var completion = _addedBlockCompletions.First();

        Assert.Equal(userId, completion.UserId);
        Assert.Equal(lessonId, completion.LessonId);
        Assert.Equal(blockId, completion.BlockId);
        Assert.True(completion.AffectsScore);

        _analyticsDbContextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Once
        );
    }

    [Fact]
    public async Task ProcessInternal_WhenLessonProgressExists_ShouldUpdateProgressAndScore()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var courseId = Guid.NewGuid();
        var lessonId = Guid.NewGuid();

        var completedBlockId = Guid.NewGuid();
        var newBlockId = Guid.NewGuid();

        var existingProgress = new LessonProgress
        {
            UserId = userId,
            CourseId = courseId,
            LessonId = lessonId,
            Progress = 25,
            Score = 1
        };

        SetupBlockCompletions(new List<BlockCompletion>
        {
            new()
            {
                UserId = userId,
                LessonId = lessonId,
                BlockId = completedBlockId,
                AffectsScore = true
            }
        });

        SetupLessonProgresses(new List<LessonProgress>
        {
            existingProgress
        });

        SetupLessonContext(lessonId, courseId, totalBlocks: 4);

        var processor = CreateProcessor();

        var @event = new BlockEvaluatedEvent
        {
            UserId = userId,
            LessonId = lessonId,
            BlockId = newBlockId,
            AffectsScore = true
        };

        // Act
        await processor.ProcessInternal(@event);

        // Assert
        Assert.Single(_addedBlockCompletions);
        Assert.Empty(_addedLessonProgresses);

        Assert.Equal(50, existingProgress.Progress);
        Assert.Equal(2, existingProgress.Score);

        _analyticsDbContextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Once
        );
    }

    [Fact]
    public async Task ProcessInternal_WhenBlockDoesNotAffectScore_ShouldUpdateProgressButNotScore()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var courseId = Guid.NewGuid();
        var lessonId = Guid.NewGuid();

        var completedBlockId = Guid.NewGuid();
        var newBlockId = Guid.NewGuid();

        var existingProgress = new LessonProgress
        {
            UserId = userId,
            CourseId = courseId,
            LessonId = lessonId,
            Progress = 25,
            Score = 1
        };

        SetupBlockCompletions(new List<BlockCompletion>
        {
            new()
            {
                UserId = userId,
                LessonId = lessonId,
                BlockId = completedBlockId,
                AffectsScore = true
            }
        });

        SetupLessonProgresses(new List<LessonProgress>
        {
            existingProgress
        });

        SetupLessonContext(lessonId, courseId, totalBlocks: 4);

        var processor = CreateProcessor();

        var @event = new BlockEvaluatedEvent
        {
            UserId = userId,
            LessonId = lessonId,
            BlockId = newBlockId,
            AffectsScore = false
        };

        // Act
        await processor.ProcessInternal(@event);

        // Assert
        Assert.Single(_addedBlockCompletions);

        Assert.Equal(50, existingProgress.Progress);
        Assert.Equal(1, existingProgress.Score);

        var completion = _addedBlockCompletions.First();

        Assert.False(completion.AffectsScore);

        _analyticsDbContextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Once
        );
    }

    [Fact]
    public async Task ProcessInternal_WhenLessonContextIsNull_ShouldReturnWithoutSaving()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var lessonId = Guid.NewGuid();
        var blockId = Guid.NewGuid();

        SetupBlockCompletions(new List<BlockCompletion>());
        SetupLessonProgresses(new List<LessonProgress>());

        _lessonContextProviderMock
            .Setup(x => x.GetAsync(lessonId))
            .ReturnsAsync((LessonContextDto?)null);

        var processor = CreateProcessor();

        var @event = new BlockEvaluatedEvent
        {
            UserId = userId,
            LessonId = lessonId,
            BlockId = blockId,
            AffectsScore = true
        };

        // Act
        await processor.ProcessInternal(@event);

        // Assert
        Assert.Empty(_addedBlockCompletions);
        Assert.Empty(_addedLessonProgresses);

        _analyticsDbContextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Never
        );
    }

    [Fact]
    public async Task ProcessInternal_WhenLessonHasZeroBlocks_ShouldReturnWithoutSaving()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var courseId = Guid.NewGuid();
        var lessonId = Guid.NewGuid();
        var blockId = Guid.NewGuid();

        SetupBlockCompletions(new List<BlockCompletion>());
        SetupLessonProgresses(new List<LessonProgress>());

        SetupLessonContext(lessonId, courseId, totalBlocks: 0);

        var processor = CreateProcessor();

        var @event = new BlockEvaluatedEvent
        {
            UserId = userId,
            LessonId = lessonId,
            BlockId = blockId,
            AffectsScore = true
        };

        // Act
        await processor.ProcessInternal(@event);

        // Assert
        Assert.Empty(_addedBlockCompletions);
        Assert.Empty(_addedLessonProgresses);

        _analyticsDbContextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Never
        );
    }

    [Fact]
    public async Task ProcessInternal_WhenSaveChangesThrowsDbUpdateException_ShouldNotThrow()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var courseId = Guid.NewGuid();
        var lessonId = Guid.NewGuid();
        var blockId = Guid.NewGuid();

        SetupBlockCompletions(new List<BlockCompletion>());
        SetupLessonProgresses(new List<LessonProgress>());

        SetupLessonContext(lessonId, courseId, totalBlocks: 4);

        _analyticsDbContextMock
            .Setup(x => x.SaveChangesAsync())
            .ThrowsAsync(new DbUpdateException());

        var processor = CreateProcessor();

        var @event = new BlockEvaluatedEvent
        {
            UserId = userId,
            LessonId = lessonId,
            BlockId = blockId,
            AffectsScore = true
        };

        // Act
        var exception = await Record.ExceptionAsync(() =>
            processor.ProcessInternal(@event)
        );

        // Assert
        Assert.Null(exception);

        Assert.Single(_addedLessonProgresses);
        Assert.Single(_addedBlockCompletions);

        _analyticsDbContextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Once
        );
    }
}