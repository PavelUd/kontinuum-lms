using AutoMapper;
using Contracts.Contracts.Groups;
using Contracts.Services;
using Groups.Application;
using Groups.Application.DTO;
using Groups.Domain;
using Groups.Infrastructure;
using MockQueryable.Moq;
using Moq;

namespace UnitTests.Groups;

public class GroupsServiceTests
{
    private readonly Mock<IGroupsDbContext> _dbContextMock = new();
    private readonly Mock<ICoursesProvider> _coursesProviderMock = new();
    private readonly Mock<IUserQueryService> _userQueryServiceMock = new();

    private readonly IMapper _mapper;

    private readonly List<Group> _groups = new();
    private readonly List<GroupMember> _groupMembers = new();

    public GroupsServiceTests()
    {
        var mapperConfig = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<GroupCreateRequest, Group>()
                .ForMember(
                    dest => dest.Title,
                    opt => opt.MapFrom(src => src.Title!.Trim())
                );

            cfg.CreateMap<PatchGroupRequest, Group>()
                .ForAllMembers(opt =>
                    opt.Condition((src, dest, srcMember) => srcMember != null));

            cfg.CreateMap<Group, GroupDto>()
                .ForMember(
                    dest => dest.TeacherId,
                    opt => opt.MapFrom(src =>
                        src.Members
                            .Where(m => m.Role == GroupRole.Teacher)
                            .Select(m => (Guid?)m.UserId)
                            .FirstOrDefault()
                    )
                );

            cfg.CreateMap<Group, GroupPreview>();
        });

        _mapper = mapperConfig.CreateMapper();

        SetupGroups(_groups);
        SetupGroupMembers(_groupMembers);

        _dbContextMock
            .Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);
    }

    private GroupsService CreateService()
    {
        return new GroupsService(
            _dbContextMock.Object,
            _mapper,
            _coursesProviderMock.Object,
            _userQueryServiceMock.Object
        );
    }

    private void SetupGroups(List<Group> groups)
    {
        var dbSetMock = groups
            .BuildMockDbSet();

        dbSetMock
            .Setup(x => x.Add(It.IsAny<Group>()))
            .Callback<Group>(groups.Add);

        dbSetMock
            .Setup(x => x.Remove(It.IsAny<Group>()))
            .Callback<Group>(group => groups.Remove(group));

        _dbContextMock
            .Setup(x => x.Groups)
            .Returns(dbSetMock.Object);
    }

    private void SetupGroupMembers(List<GroupMember> groupMembers)
    {
        var dbSetMock = groupMembers
            .BuildMockDbSet();

        dbSetMock
            .Setup(x => x.Add(It.IsAny<GroupMember>()))
            .Callback<GroupMember>(groupMembers.Add);

        _dbContextMock
            .Setup(x => x.GroupMembers)
            .Returns(dbSetMock.Object);
    }

    [Fact]
    public async Task CreateGroup_WhenTitleIsEmpty_ShouldReturnFailure()
    {
        // Arrange
        var service = CreateService();

        var request = new GroupCreateRequest
        {
            Title = "",
            CourseId = Guid.NewGuid(),
            TeacherId = Guid.NewGuid()
        };

        // Act
        var result = await service.CreateGroup(request);

        // Assert
        Assert.False(result.Succeeded);
        Assert.Contains("required", result.Errors.First());

        Assert.Empty(_groups);
        Assert.Empty(_groupMembers);

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never
        );
    }

    [Fact]
    public async Task CreateGroup_WhenTitleContainsOnlySpaces_ShouldReturnFailure()
    {
        // Arrange
        var service = CreateService();

        var request = new GroupCreateRequest
        {
            Title = "     ",
            CourseId = Guid.NewGuid(),
            TeacherId = Guid.NewGuid()
        };

        // Act
        var result = await service.CreateGroup(request);

        // Assert
        Assert.False(result.Succeeded);

        Assert.Empty(_groups);
        Assert.Empty(_groupMembers);

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never
        );
    }

    [Fact]
    public async Task CreateGroup_WhenTitleAlreadyExistsInSameCourse_ShouldReturnFailure()
    {
        // Arrange
        var courseId = Guid.NewGuid();

        _groups.Add(new Group
        {
            Id = Guid.NewGuid(),
            CourseId = courseId,
            Title = "РИ-420934"
        });

        SetupGroups(_groups);

        var service = CreateService();

        var request = new GroupCreateRequest
        {
            Title = "РИ-420934",
            CourseId = courseId,
            TeacherId = Guid.NewGuid()
        };

        // Act
        var result = await service.CreateGroup(request);

        // Assert
        Assert.False(result.Succeeded);
        Assert.Contains("already exists", result.Errors.First());

        Assert.Single(_groups);
        Assert.Empty(_groupMembers);

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never
        );
    }

    [Fact]
    public async Task CreateGroup_WhenTitleAlreadyExistsInSameCourseWithDifferentCase_ShouldReturnFailure()
    {
        // Arrange
        var courseId = Guid.NewGuid();

        _groups.Add(new Group
        {
            Id = Guid.NewGuid(),
            CourseId = courseId,
            Title = "РИ-420934"
        });

        SetupGroups(_groups);

        var service = CreateService();

        var request = new GroupCreateRequest
        {
            Title = "ри-420934",
            CourseId = courseId,
            TeacherId = Guid.NewGuid()
        };

        // Act
        var result = await service.CreateGroup(request);

        // Assert
        Assert.False(result.Succeeded);

        Assert.Single(_groups);
        Assert.Empty(_groupMembers);

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never
        );
    }

    [Fact]
    public async Task CreateGroup_WhenTitleExistsInAnotherCourse_ShouldCreateGroup()
    {
        // Arrange
        var existingCourseId = Guid.NewGuid();
        var targetCourseId = Guid.NewGuid();
        var teacherId = Guid.NewGuid();

        _groups.Add(new Group
        {
            Id = Guid.NewGuid(),
            CourseId = existingCourseId,
            Title = "РИ-420934"
        });

        SetupGroups(_groups);

        var service = CreateService();

        var request = new GroupCreateRequest
        {
            Title = "РИ-420934",
            CourseId = targetCourseId,
            TeacherId = teacherId
        };

        // Act
        var result = await service.CreateGroup(request);

        // Assert
        Assert.True(result.Succeeded);

        Assert.Equal(2, _groups.Count);
        Assert.Single(_groupMembers);

        var createdGroup = _groups.First(x => x.CourseId == targetCourseId);

        Assert.Equal("РИ-420934", createdGroup.Title);
        Assert.Equal(createdGroup.Id, result.Data);

        var teacherMember = _groupMembers.First();

        Assert.Equal(createdGroup.Id, teacherMember.GroupId);
        Assert.Equal(teacherId, teacherMember.UserId);
        Assert.Equal(GroupRole.Teacher, teacherMember.Role);

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once
        );
    }

    [Fact]
    public async Task CreateGroup_WhenRequestIsValid_ShouldCreateGroupAndTeacherMember()
    {
        // Arrange
        var courseId = Guid.NewGuid();
        var teacherId = Guid.NewGuid();

        var service = CreateService();

        var request = new GroupCreateRequest
        {
            Title = "РИ-420934",
            CourseId = courseId,
            TeacherId = teacherId
        };

        // Act
        var result = await service.CreateGroup(request);

        // Assert
        Assert.True(result.Succeeded);

        Assert.Single(_groups);
        Assert.Single(_groupMembers);

        var group = _groups.First();

        Assert.Equal(courseId, group.CourseId);
        Assert.Equal("РИ-420934", group.Title);
        Assert.Equal(group.Id, result.Data);

        var teacherMember = _groupMembers.First();

        Assert.Equal(group.Id, teacherMember.GroupId);
        Assert.Equal(teacherId, teacherMember.UserId);
        Assert.Equal(GroupRole.Teacher, teacherMember.Role);

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once
        );
    }

    [Fact]
    public async Task CreateGroup_WhenTitleHasSpaces_ShouldTrimTitle()
    {
        // Arrange
        var service = CreateService();

        var request = new GroupCreateRequest
        {
            Title = "   РИ-420934   ",
            CourseId = Guid.NewGuid(),
            TeacherId = Guid.NewGuid()
        };

        // Act
        var result = await service.CreateGroup(request);

        // Assert
        Assert.True(result.Succeeded);
        Assert.Single(_groups);

        Assert.Equal("РИ-420934", _groups.First().Title);
    }

    [Fact]
    public async Task PatchGroup_WhenGroupNotFound_ShouldReturnFailure()
    {
        // Arrange
        var service = CreateService();

        var request = new PatchGroupRequest
        {
            Title = "Новое название"
        };

        // Act
        var result = await service.PatchGroup(Guid.NewGuid(), request);

        // Assert
        Assert.False(result.Succeeded);
        Assert.Contains("Group not found", result.Errors.First());

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never
        );
    }

    [Fact]
    public async Task PatchGroup_WhenTitleIsEmpty_ShouldReturnFailure()
    {
        // Arrange
        var groupId = Guid.NewGuid();

        _groups.Add(new Group
        {
            Id = groupId,
            CourseId = Guid.NewGuid(),
            Title = "Старое название"
        });

        SetupGroups(_groups);

        var service = CreateService();

        var request = new PatchGroupRequest
        {
            Title = ""
        };

        // Act
        var result = await service.PatchGroup(groupId, request);

        // Assert
        Assert.False(result.Succeeded);

        Assert.Equal("Старое название", _groups.First().Title);

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never
        );
    }

    [Fact]
    public async Task PatchGroup_WhenTitleContainsOnlySpaces_ShouldReturnFailure()
    {
        // Arrange
        var groupId = Guid.NewGuid();

        _groups.Add(new Group
        {
            Id = groupId,
            CourseId = Guid.NewGuid(),
            Title = "Старое название"
        });

        SetupGroups(_groups);

        var service = CreateService();

        var request = new PatchGroupRequest
        {
            Title = "     "
        };

        // Act
        var result = await service.PatchGroup(groupId, request);

        // Assert
        Assert.False(result.Succeeded);

        Assert.Equal("Старое название", _groups.First().Title);

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never
        );
    }

    [Fact]
    public async Task PatchGroup_WhenTitleAlreadyExistsInSameCourse_ShouldReturnFailure()
    {
        // Arrange
        var courseId = Guid.NewGuid();

        var groupId = Guid.NewGuid();
        var otherGroupId = Guid.NewGuid();

        _groups.AddRange(new[]
        {
            new Group
            {
                Id = groupId,
                CourseId = courseId,
                Title = "РИ-420934"
            },
            new Group
            {
                Id = otherGroupId,
                CourseId = courseId,
                Title = "РИ-420935"
            }
        });

        SetupGroups(_groups);

        var service = CreateService();

        var request = new PatchGroupRequest
        {
            Title = "РИ-420935"
        };

        // Act
        var result = await service.PatchGroup(groupId, request);

        // Assert
        Assert.False(result.Succeeded);
        Assert.Contains("already exists", result.Errors.First());

        Assert.Equal("РИ-420934", _groups.First(x => x.Id == groupId).Title);

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never
        );
    }

    [Fact]
    public async Task PatchGroup_WhenTitleAlreadyExistsInAnotherCourse_ShouldUpdateGroup()
    {
        // Arrange
        var courseId = Guid.NewGuid();
        var anotherCourseId = Guid.NewGuid();

        var groupId = Guid.NewGuid();

        _groups.AddRange(new[]
        {
            new Group
            {
                Id = groupId,
                CourseId = courseId,
                Title = "Старое название"
            },
            new Group
            {
                Id = Guid.NewGuid(),
                CourseId = anotherCourseId,
                Title = "РИ-420935"
            }
        });

        SetupGroups(_groups);

        var service = CreateService();

        var request = new PatchGroupRequest
        {
            Title = "РИ-420935"
        };

        // Act
        var result = await service.PatchGroup(groupId, request);

        // Assert
        Assert.True(result.Succeeded);

        Assert.Equal("РИ-420935", _groups.First(x => x.Id == groupId).Title);

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once
        );
    }

    [Fact]
    public async Task PatchGroup_WhenRequestIsValid_ShouldUpdateTitle()
    {
        // Arrange
        var groupId = Guid.NewGuid();

        _groups.Add(new Group
        {
            Id = groupId,
            CourseId = Guid.NewGuid(),
            Title = "Старое название"
        });

        SetupGroups(_groups);

        var service = CreateService();

        var request = new PatchGroupRequest
        {
            Title = "Новое название"
        };

        // Act
        var result = await service.PatchGroup(groupId, request);

        // Assert
        Assert.True(result.Succeeded);

        Assert.Equal("Новое название", _groups.First().Title);

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once
        );
    }

    [Fact]
    public async Task DeleteGroup_WhenGroupNotFound_ShouldReturnSuccess()
    {
        // Arrange
        var service = CreateService();

        // Act
        var result = await service.DeleteGroup(Guid.NewGuid(), CancellationToken.None);

        // Assert
        Assert.True(result.Succeeded);

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never
        );
    }

    [Fact]
    public async Task DeleteGroup_WhenGroupExists_ShouldRemoveGroup()
    {
        // Arrange
        var groupId = Guid.NewGuid();

        _groups.Add(new Group
        {
            Id = groupId,
            CourseId = Guid.NewGuid(),
            Title = "РИ-420934"
        });

        SetupGroups(_groups);

        var service = CreateService();

        // Act
        var result = await service.DeleteGroup(groupId, CancellationToken.None);

        // Assert
        Assert.True(result.Succeeded);
        Assert.Empty(_groups);

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once
        );
    }
}