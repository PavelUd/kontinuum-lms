using System.Text.Json;
using AutoMapper;
using BlockEngine.Application.DTO;
using BlockEngine.Application.Interfaces;
using BlockEngine.Application.Plugins.Text;
using BlockEngine.Application.Services;
using BlockEngine.Domain.Entities;
using BlockEngine.Domain.Enum;
using BlockEngine.Infrastructure;
using Contracts.Contracts.Blocks;
using Contracts.Services.Courses;
using Core;
using MockQueryable.Moq;
using Moq;

namespace UnitTests.BlockEngine;

public class BlockServiceTests
{
    private readonly Mock<ILessonBlockDbContext> _dbContextMock = new();
    private readonly Mock<IBlockEngine> _blockEngineMock = new();
    private readonly Mock<IBlockOrderService> _blockOrderServiceMock = new();
    private readonly Mock<ILessonGuard> _lessonGuardMock = new();

    private readonly IMapper _mapper;

    private readonly List<LessonBlock> _lessonBlocks = new();

    public BlockServiceTests()
    {
        var mapperConfig = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<BlockCreateRequest, LessonBlock>();
            cfg.CreateMap<LessonBlock, LessonBlockDto>();
        });

        _mapper = mapperConfig.CreateMapper();

        SetupLessonBlocks(_lessonBlocks);

        _dbContextMock
            .Setup(x => x.SaveChangesAsync())
            .ReturnsAsync(1);
    }

    private BlockService CreateService()
    {
        return new BlockService(
            _dbContextMock.Object,
            _blockEngineMock.Object,
            _mapper,
            _blockOrderServiceMock.Object,
            _lessonGuardMock.Object
        );
    }

    private void SetupLessonBlocks(List<LessonBlock> blocks)
    {
        var dbSetMock = blocks
            .BuildMockDbSet();

        dbSetMock
            .Setup(x => x.Add(It.IsAny<LessonBlock>()))
            .Callback<LessonBlock>(blocks.Add);

        dbSetMock
            .Setup(x => x.Remove(It.IsAny<LessonBlock>()))
            .Callback<LessonBlock>(block => blocks.Remove(block));

        _dbContextMock
            .Setup(x => x.LessonBlocks)
            .Returns(dbSetMock.Object);
    }

    private static JsonElement TextContent(string text)
    {
        return JsonSerializer.SerializeToElement(new TextBlockContent
        {
            Text = text
        });
    }

    private static void AssertJsonEqual(JsonElement expected, JsonElement actual)
    {
        Assert.Equal(expected.GetRawText(), actual.GetRawText());
    }

    [Fact]
    public async Task CreateLessonBlock_WhenPreProcessFailed_ShouldReturnFailure()
    {
        // Arrange
        var lessonId = Guid.NewGuid();

        var content = TextContent("<script>alert(1)</script>");

        var request = new BlockCreateRequest
        {
            Type = BlockType.Text,
            Content = content
        };

        _blockEngineMock
            .Setup(x => x.PreProcessAsync(request.Type, request.Content))
            .ReturnsAsync(Result<JsonElement>.Failure("Invalid content"));

        var service = CreateService();

        // Act
        var result = await service.CreateLessonBlock(request, lessonId);

        // Assert
        Assert.False(result.Succeeded);
        Assert.Empty(_lessonBlocks);

        _lessonGuardMock.Verify(
            x => x.EnsureEditable(lessonId),
            Times.Once
        );

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Never
        );
    }

    [Fact]
    public async Task CreateLessonBlock_WhenRequestIsValid_ShouldCreateBlock()
    {
        // Arrange
        var lessonId = Guid.NewGuid();

        var content = TextContent("<p>Текст блока</p>");

        var request = new BlockCreateRequest
        {
            Type = BlockType.Text,
            Content = content
        };

        _blockEngineMock
            .Setup(x => x.PreProcessAsync(request.Type, request.Content))
            .ReturnsAsync(Result<JsonElement>.Success(content));

        var service = CreateService();

        // Act
        var result = await service.CreateLessonBlock(request, lessonId);

        // Assert
        Assert.True(result.Succeeded);
        Assert.Single(_lessonBlocks);

        var createdBlock = _lessonBlocks.First();

        Assert.Equal(lessonId, createdBlock.LessonId);
        Assert.Equal(BlockType.Text, createdBlock.Type);
        AssertJsonEqual(content, createdBlock.Content);
        Assert.Equal(0, createdBlock.OrderIndex);
        Assert.Equal(createdBlock.Id, result.Data);

        _lessonGuardMock.Verify(
            x => x.EnsureEditable(lessonId),
            Times.Once
        );

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Once
        );
    }

    [Fact]
    public async Task CreateLessonBlock_WhenLessonHasBlocks_ShouldSetOrderIndexToMaxPlusOne()
    {
        // Arrange
        var lessonId = Guid.NewGuid();

        var block1Content = TextContent("Блок 1");
        var block2Content = TextContent("Блок 2");
        var newBlockContent = TextContent("Новый блок");

        _lessonBlocks.AddRange(new[]
        {
            new LessonBlock
            {
                Id = Guid.NewGuid(),
                LessonId = lessonId,
                Type = BlockType.Text,
                Content = block1Content,
                OrderIndex = 0
            },
            new LessonBlock
            {
                Id = Guid.NewGuid(),
                LessonId = lessonId,
                Type = BlockType.Text,
                Content = block2Content,
                OrderIndex = 1
            }
        });

        SetupLessonBlocks(_lessonBlocks);

        var request = new BlockCreateRequest
        {
            Type = BlockType.Text,
            Content = newBlockContent
        };

        _blockEngineMock
            .Setup(x => x.PreProcessAsync(request.Type, request.Content))
            .ReturnsAsync(Result<JsonElement>.Success(newBlockContent));

        var service = CreateService();

        // Act
        var result = await service.CreateLessonBlock(request, lessonId);

        // Assert
        Assert.True(result.Succeeded);
        Assert.Equal(3, _lessonBlocks.Count);

        var createdBlock = _lessonBlocks.First(x =>
            x.Content.GetRawText() == newBlockContent.GetRawText());

        Assert.Equal(2, createdBlock.OrderIndex);

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Once
        );
    }

    [Fact]
    public async Task CreateLessonBlock_WhenGuardThrows_ShouldReturnFailure()
    {
        // Arrange
        var lessonId = Guid.NewGuid();

        var request = new BlockCreateRequest
        {
            Type = BlockType.Text,
            Content = TextContent("Текст")
        };

        _lessonGuardMock
            .Setup(x => x.EnsureEditable(lessonId))
            .ThrowsAsync(new Exception("Lesson is not editable"));

        var service = CreateService();

        // Act
        var result = await service.CreateLessonBlock(request, lessonId);

        // Assert
        Assert.False(result.Succeeded);
        Assert.Contains("Lesson is not editable", result.Errors.First());

        Assert.Empty(_lessonBlocks);

        _blockEngineMock.Verify(
            x => x.PreProcessAsync(It.IsAny<BlockType>(), It.IsAny<JsonElement>()),
            Times.Never
        );

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Never
        );
    }

    [Fact]
    public async Task UpdateBlockContent_WhenBlockNotFound_ShouldReturnSuccessWithoutSaving()
    {
        // Arrange
        var service = CreateService();

        var request = new UpdateContentRequest
        {
            Content = TextContent("Новый контент")
        };

        // Act
        var result = await service.UpdateBlockContent(request, Guid.NewGuid());

        // Assert
        Assert.True(result.Succeeded);

        _lessonGuardMock.Verify(
            x => x.EnsureEditable(It.IsAny<Guid>()),
            Times.Never
        );

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Never
        );
    }

    [Fact]
    public async Task UpdateBlockContent_WhenPreProcessFailed_ShouldReturnFailure()
    {
        // Arrange
        var lessonId = Guid.NewGuid();
        var blockId = Guid.NewGuid();

        var oldContent = TextContent("Старый контент");
        var invalidContent = TextContent("<script>alert(1)</script>");

        _lessonBlocks.Add(new LessonBlock
        {
            Id = blockId,
            LessonId = lessonId,
            Type = BlockType.Text,
            Content = oldContent,
            OrderIndex = 0
        });

        SetupLessonBlocks(_lessonBlocks);

        var request = new UpdateContentRequest
        {
            Content = invalidContent
        };

        _blockEngineMock
            .Setup(x => x.PreProcessAsync(BlockType.Text, request.Content))
            .ReturnsAsync(Result<JsonElement>.Failure("Invalid content"));

        var service = CreateService();

        // Act
        var result = await service.UpdateBlockContent(request, blockId);

        // Assert
        Assert.False(result.Succeeded);

        var block = _lessonBlocks.First();

        AssertJsonEqual(oldContent, block.Content);

        _lessonGuardMock.Verify(
            x => x.EnsureEditable(lessonId),
            Times.Once
        );

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Never
        );
    }

    [Fact]
    public async Task UpdateBlockContent_WhenRequestIsValid_ShouldUpdateContent()
    {
        // Arrange
        var lessonId = Guid.NewGuid();
        var blockId = Guid.NewGuid();

        var oldContent = TextContent("Старый контент");
        var newContent = TextContent("<p>Новый контент</p>");

        _lessonBlocks.Add(new LessonBlock
        {
            Id = blockId,
            LessonId = lessonId,
            Type = BlockType.Text,
            Content = oldContent,
            OrderIndex = 0
        });

        SetupLessonBlocks(_lessonBlocks);

        var request = new UpdateContentRequest
        {
            Content = newContent
        };

        _blockEngineMock
            .Setup(x => x.PreProcessAsync(BlockType.Text, request.Content))
            .ReturnsAsync(Result<JsonElement>.Success(newContent));

        var service = CreateService();

        // Act
        var result = await service.UpdateBlockContent(request, blockId);

        // Assert
        Assert.True(result.Succeeded);

        var block = _lessonBlocks.First();

        AssertJsonEqual(newContent, block.Content);

        _lessonGuardMock.Verify(
            x => x.EnsureEditable(lessonId),
            Times.Once
        );

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Once
        );
    }

    [Fact]
    public async Task DeleteLessonBlock_WhenBlockNotFound_ShouldReturnSuccessWithoutSaving()
    {
        // Arrange
        var service = CreateService();

        // Act
        var result = await service.DeleteLessonBlock(Guid.NewGuid());

        // Assert
        Assert.True(result.Succeeded);

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Never
        );

        _blockEngineMock.Verify(
            x => x.OnRemovingAsync(
                It.IsAny<BlockType>(),
                It.IsAny<Guid>(),
                It.IsAny<Guid>()),
            Times.Never
        );
    }

    [Fact]
    public async Task DeleteLessonBlock_WhenBlockExists_ShouldRemoveBlockAndCallOnRemoving()
    {
        // Arrange
        var lessonId = Guid.NewGuid();
        var blockId = Guid.NewGuid();

        var content = TextContent("Контент");

        _lessonBlocks.Add(new LessonBlock
        {
            Id = blockId,
            LessonId = lessonId,
            Type = BlockType.Text,
            Content = content,
            OrderIndex = 0
        });

        SetupLessonBlocks(_lessonBlocks);

        var service = CreateService();

        // Act
        var result = await service.DeleteLessonBlock(blockId);

        // Assert
        Assert.True(result.Succeeded);
        Assert.Empty(_lessonBlocks);

        _lessonGuardMock.Verify(
            x => x.EnsureEditable(lessonId),
            Times.Once
        );

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Once
        );

        _blockEngineMock.Verify(
            x => x.OnRemovingAsync(BlockType.Text, blockId, lessonId),
            Times.Once
        );
    }

    [Fact]
    public async Task DeleteLessonBlock_WhenGuardThrows_ShouldReturnFailure()
    {
        // Arrange
        var lessonId = Guid.NewGuid();
        var blockId = Guid.NewGuid();

        _lessonBlocks.Add(new LessonBlock
        {
            Id = blockId,
            LessonId = lessonId,
            Type = BlockType.Text,
            Content = TextContent("Контент"),
            OrderIndex = 0
        });

        SetupLessonBlocks(_lessonBlocks);

        _lessonGuardMock
            .Setup(x => x.EnsureEditable(lessonId))
            .ThrowsAsync(new Exception("Lesson is not editable"));

        var service = CreateService();

        // Act
        var result = await service.DeleteLessonBlock(blockId);

        // Assert
        Assert.False(result.Succeeded);
        Assert.Single(_lessonBlocks);

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Never
        );

        _blockEngineMock.Verify(
            x => x.OnRemovingAsync(
                It.IsAny<BlockType>(),
                It.IsAny<Guid>(),
                It.IsAny<Guid>()),
            Times.Never
        );
    }

    [Fact]
    public async Task MoveBlock_WhenBlockNotFound_ShouldReturnFailure()
    {
        // Arrange
        var service = CreateService();

        // Act
        var result = await service.MoveBlock(
            Guid.NewGuid(),
            Guid.NewGuid(),
            Guid.NewGuid()
        );

        // Assert
        Assert.False(result.Succeeded);
        Assert.Contains("Block not found", result.Errors.First());

        _lessonGuardMock.Verify(
            x => x.EnsureEditable(It.IsAny<Guid>()),
            Times.Never
        );

        _blockOrderServiceMock.Verify(
            x => x.MoveBlock(
                It.IsAny<LessonBlock>(),
                It.IsAny<Guid?>(),
                It.IsAny<Guid?>()),
            Times.Never
        );
    }

    [Fact]
    public async Task MoveBlock_WhenBlockExists_ShouldCallGuardAndOrderService()
    {
        // Arrange
        var lessonId = Guid.NewGuid();
        var blockId = Guid.NewGuid();

        var aboveId = Guid.NewGuid();
        var belowId = Guid.NewGuid();

        var block = new LessonBlock
        {
            Id = blockId,
            LessonId = lessonId,
            Type = BlockType.Text,
            Content = TextContent("Контент"),
            OrderIndex = 1
        };

        _lessonBlocks.Add(block);

        SetupLessonBlocks(_lessonBlocks);

        var service = CreateService();

        // Act
        var result = await service.MoveBlock(blockId, aboveId, belowId);

        // Assert
        Assert.True(result.Succeeded);

        _lessonGuardMock.Verify(
            x => x.EnsureEditable(lessonId),
            Times.Once
        );

        _blockOrderServiceMock.Verify(
            x => x.MoveBlock(block, aboveId, belowId),
            Times.Once
        );
    }

    [Fact]
    public async Task MoveBlock_WhenOrderServiceThrows_ShouldReturnFailure()
    {
        // Arrange
        var lessonId = Guid.NewGuid();
        var blockId = Guid.NewGuid();

        var block = new LessonBlock
        {
            Id = blockId,
            LessonId = lessonId,
            Type = BlockType.Text,
            Content = TextContent("Контент"),
            OrderIndex = 1
        };

        _lessonBlocks.Add(block);

        SetupLessonBlocks(_lessonBlocks);

        _blockOrderServiceMock
            .Setup(x => x.MoveBlock(
                It.IsAny<LessonBlock>(),
                It.IsAny<Guid?>(),
                It.IsAny<Guid?>()))
            .ThrowsAsync(new Exception("Move failed"));

        var service = CreateService();

        // Act
        var result = await service.MoveBlock(blockId, null, null);

        // Assert
        Assert.False(result.Succeeded);
        Assert.Contains("Move failed", result.Errors.First());
    }

    [Fact]
    public async Task GetByLessonIdAsync_ShouldReturnTotalAndScoredBlocks()
    {
        // Arrange
        var lessonId = Guid.NewGuid();

        _lessonBlocks.AddRange(new[]
        {
            new LessonBlock
            {
                Id = Guid.NewGuid(),
                LessonId = lessonId,
                Type = BlockType.Text,
                Content = TextContent("Текст")
            },
            new LessonBlock
            {
                Id = Guid.NewGuid(),
                LessonId = lessonId,
                Type = BlockType.ChoiceQuestion,
                Content = JsonSerializer.SerializeToElement(new
                {
                    question = "Вопрос",
                    options = new[] { "1", "2" },
                    answer = "1"
                })
            },
            new LessonBlock
            {
                Id = Guid.NewGuid(),
                LessonId = lessonId,
                Type = BlockType.OpenQuestion,
                Content = JsonSerializer.SerializeToElement(new
                {
                    question = "Открытый вопрос",
                    answer = "Ответ"
                })
            },
            new LessonBlock
            {
                Id = Guid.NewGuid(),
                LessonId = Guid.NewGuid(),
                Type = BlockType.ChoiceQuestion,
                Content = JsonSerializer.SerializeToElement(new
                {
                    question = "Чужой вопрос",
                    options = new[] { "1", "2" },
                    answer = "1"
                })
            }
        });

        SetupLessonBlocks(_lessonBlocks);

        var service = CreateService();

        // Act
        var result = await service.GetByLessonIdAsync(lessonId);

        // Assert
        Assert.Equal(3, result.TotalBlocks);
        Assert.Equal(2, result.ScoredBlocks);
    }

    [Fact]
    public async Task GetByLessonsIdAsync_ShouldReturnStatsGroupedByLesson()
    {
        // Arrange
        var lesson1Id = Guid.NewGuid();
        var lesson2Id = Guid.NewGuid();
        var lesson3Id = Guid.NewGuid();

        _lessonBlocks.AddRange(new[]
        {
            new LessonBlock
            {
                Id = Guid.NewGuid(),
                LessonId = lesson1Id,
                Type = BlockType.Text,
                Content = TextContent("Текст")
            },
            new LessonBlock
            {
                Id = Guid.NewGuid(),
                LessonId = lesson1Id,
                Type = BlockType.ChoiceQuestion,
                Content = JsonSerializer.SerializeToElement(new
                {
                    question = "Вопрос",
                    options = new[] { "1", "2" },
                    answer = "1"
                })
            },
            new LessonBlock
            {
                Id = Guid.NewGuid(),
                LessonId = lesson2Id,
                Type = BlockType.OpenQuestion,
                Content = JsonSerializer.SerializeToElement(new
                {
                    question = "Открытый вопрос",
                    answer = "Ответ"
                })
            },
            new LessonBlock
            {
                Id = Guid.NewGuid(),
                LessonId = lesson2Id,
                Type = BlockType.Text,
                Content = TextContent("Текст")
            },
            new LessonBlock
            {
                Id = Guid.NewGuid(),
                LessonId = lesson3Id,
                Type = BlockType.ChoiceQuestion,
                Content = JsonSerializer.SerializeToElement(new
                {
                    question = "Не должен попасть в результат",
                    options = new[] { "1", "2" },
                    answer = "1"
                })
            }
        });

        SetupLessonBlocks(_lessonBlocks);

        var service = CreateService();

        // Act
        var result = await service.GetByLessonsIdAsync(new List<Guid>
        {
            lesson1Id,
            lesson2Id
        });

        // Assert
        Assert.Equal(2, result.Count);

        var lesson1Stats = result.First(x => x.LessonId == lesson1Id);
        Assert.Equal(2, lesson1Stats.TotalBlocks);
        Assert.Equal(1, lesson1Stats.ScoredBlocks);

        var lesson2Stats = result.First(x => x.LessonId == lesson2Id);
        Assert.Equal(2, lesson2Stats.TotalBlocks);
        Assert.Equal(1, lesson2Stats.ScoredBlocks);
    }

    [Fact]
    public async Task GetBlockByLesson_ShouldReturnOrderedAndRenderedBlocks()
    {
        // Arrange
        var lessonId = Guid.NewGuid();

        var firstBlockId = Guid.NewGuid();
        var secondBlockId = Guid.NewGuid();

        var firstContent = TextContent("first");
        var secondContent = TextContent("second");

        var renderedFirstContent = TextContent("rendered first");
        var renderedSecondContent = TextContent("rendered second");

        _lessonBlocks.AddRange(new[]
        {
            new LessonBlock
            {
                Id = secondBlockId,
                LessonId = lessonId,
                Type = BlockType.Text,
                Content = secondContent,
                OrderIndex = 2
            },
            new LessonBlock
            {
                Id = firstBlockId,
                LessonId = lessonId,
                Type = BlockType.Text,
                Content = firstContent,
                OrderIndex = 1
            }
        });

        SetupLessonBlocks(_lessonBlocks);

        _blockEngineMock
            .Setup(x => x.RenderAsync(BlockType.Text, firstContent))
            .ReturnsAsync(renderedFirstContent);

        _blockEngineMock
            .Setup(x => x.RenderAsync(BlockType.Text, secondContent))
            .ReturnsAsync(renderedSecondContent);

        var service = CreateService();

        // Act
        var result = await service.GetBlockByLesson(lessonId);

        // Assert
        Assert.True(result.Succeeded);
        Assert.Equal(2, result.Data.Count);

        Assert.Equal(firstBlockId, result.Data[0].Id);
        Assert.Equal(secondBlockId, result.Data[1].Id);
    }
}