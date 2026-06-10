using AutoMapper;
using Contracts.Services;
using Groups.Application;
using Groups.Application.DTO;
using Groups.Domain;
using Groups.Infrastructure;
using MockQueryable.Moq;
using Moq;

namespace UnitTests.Groups;

public class GroupMembersServiceTests
{
    private readonly Mock<IGroupsDbContext> _dbContextMock = new();
    private readonly Mock<IUserQueryService> _userQueryServiceMock = new();

    private readonly IMapper _mapper;

    private readonly List<Group> _groups = new();
    private readonly List<GroupMember> _groupMembers = new();

    public GroupMembersServiceTests()
    {
        var mapperConfig = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<CreateGroupMemberRequest, GroupMember>();

            cfg.CreateMap<GroupMember, GroupMemberDto>();

            cfg.CreateMap<GroupMember, GroupMemberDto>()
                .ForMember(
                    dest => dest.FullName,
                    opt => opt.Ignore()
                );
        });

        _mapper = mapperConfig.CreateMapper();

        SetupGroups(_groups);
        SetupGroupMembers(_groupMembers);

        _dbContextMock
            .Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        _dbContextMock
            .Setup(x => x.SaveChangesAsync())
            .ReturnsAsync(1);
    }

    private GroupMembersService CreateService()
    {
        return new GroupMembersService(
            _dbContextMock.Object,
            _mapper,
            _userQueryServiceMock.Object
        );
    }

    private void SetupGroups(List<Group> groups)
    {
        var dbSetMock = groups
            .BuildMockDbSet();

        _dbContextMock
            .Setup(x => x.Groups)
            .Returns(dbSetMock.Object);
    }

    private void SetupGroupMembers(List<GroupMember> members)
    {
        var dbSetMock = members
            .BuildMockDbSet();

        dbSetMock
            .Setup(x => x.Add(It.IsAny<GroupMember>()))
            .Callback<GroupMember>(members.Add);

        dbSetMock
            .Setup(x => x.Remove(It.IsAny<GroupMember>()))
            .Callback<GroupMember>(member => members.Remove(member));

        _dbContextMock
            .Setup(x => x.GroupMembers)
            .Returns(dbSetMock.Object);
    }

    [Fact]
    public async Task GetGroupMembers_ShouldReturnOnlyStudentsFromSelectedGroup()
    {
        // Arrange
        var groupId = Guid.NewGuid();
        var anotherGroupId = Guid.NewGuid();

        var student1Id = Guid.NewGuid();
        var student2Id = Guid.NewGuid();
        var teacherId = Guid.NewGuid();

        _groupMembers.AddRange(new[]
        {
            new GroupMember
            {
                Id = Guid.NewGuid(),
                GroupId = groupId,
                UserId = student1Id,
                Role = GroupRole.Student,
                JoinedAt = DateTime.UtcNow.AddDays(-1)
            },
            new GroupMember
            {
                Id = Guid.NewGuid(),
                GroupId = groupId,
                UserId = student2Id,
                Role = GroupRole.Student,
                JoinedAt = DateTime.UtcNow
            },
            new GroupMember
            {
                Id = Guid.NewGuid(),
                GroupId = groupId,
                UserId = teacherId,
                Role = GroupRole.Teacher,
                JoinedAt = DateTime.UtcNow
            },
            new GroupMember
            {
                Id = Guid.NewGuid(),
                GroupId = anotherGroupId,
                UserId = Guid.NewGuid(),
                Role = GroupRole.Student,
                JoinedAt = DateTime.UtcNow
            }
        });

        SetupGroupMembers(_groupMembers);

        _userQueryServiceMock
            .Setup(x => x.GetUsersDictionary(It.IsAny<List<Guid>>()))
            .ReturnsAsync(new Dictionary<Guid, string>
            {
                [student1Id] = "Иванов Иван",
                [student2Id] = "Петров Петр"
            });

        var service = CreateService();

        var request = new GetGroupMembersQuery
        {
            Page = 1,
            PageSize = 10
        };

        // Act
        var result = await service.GetGroupMembers(
            request,
            groupId,
            CancellationToken.None
        );

        // Assert
        Assert.Equal(2, result.Items.Count);

        Assert.Contains(result.Items, x => x.UserId == student1Id);
        Assert.Contains(result.Items, x => x.UserId == student2Id);

        Assert.DoesNotContain(result.Items, x => x.UserId == teacherId);

        Assert.Contains(result.Items, x => x.FullName == "Иванов Иван");
        Assert.Contains(result.Items, x => x.FullName == "Петров Петр");
    }

    [Fact]
    public async Task DeleteGroupMember_WhenMemberNotFound_ShouldReturnSuccess()
    {
        // Arrange
        var service = CreateService();

        // Act
        var result = await service.DeleteGroupMember(
            Guid.NewGuid(),
            CancellationToken.None
        );

        // Assert
        Assert.True(result.Succeeded);

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never
        );
    }

    [Fact]
    public async Task DeleteGroupMember_WhenMemberIsTeacher_ShouldNotDeleteAndReturnSuccess()
    {
        // Arrange
        var memberId = Guid.NewGuid();

        _groupMembers.Add(new GroupMember
        {
            Id = memberId,
            GroupId = Guid.NewGuid(),
            UserId = Guid.NewGuid(),
            Role = GroupRole.Teacher
        });

        SetupGroupMembers(_groupMembers);

        var service = CreateService();

        // Act
        var result = await service.DeleteGroupMember(
            memberId,
            CancellationToken.None
        );

        // Assert
        Assert.True(result.Succeeded);
        Assert.Single(_groupMembers);

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never
        );
    }

    [Fact]
    public async Task DeleteGroupMember_WhenMemberIsStudent_ShouldRemoveMember()
    {
        // Arrange
        var memberId = Guid.NewGuid();

        _groupMembers.Add(new GroupMember
        {
            Id = memberId,
            GroupId = Guid.NewGuid(),
            UserId = Guid.NewGuid(),
            Role = GroupRole.Student
        });

        SetupGroupMembers(_groupMembers);

        var service = CreateService();

        // Act
        var result = await service.DeleteGroupMember(
            memberId,
            CancellationToken.None
        );

        // Assert
        Assert.True(result.Succeeded);
        Assert.Empty(_groupMembers);

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once
        );
    }

    [Fact]
    public async Task SetGroupTeacher_WhenGroupNotFound_ShouldReturnFailure()
    {
        // Arrange
        var service = CreateService();

        var request = new SetGroupTeacherRequest
        {
            TeacherId = Guid.NewGuid()
        };

        // Act
        var result = await service.SetGroupTeacher(Guid.NewGuid(), request);

        // Assert
        Assert.False(result.Succeeded);
        Assert.Contains("Group not found", result.Errors.First());

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Never
        );
    }

    [Fact]
    public async Task SetGroupTeacher_WhenTeacherNotExists_ShouldCreateTeacherMember()
    {
        // Arrange
        var groupId = Guid.NewGuid();
        var teacherId = Guid.NewGuid();

        _groups.Add(new Group
        {
            Id = groupId,
            Title = "РИ-420934",
            CourseId = Guid.NewGuid(),
            Members = new List<GroupMember>()
        });

        SetupGroups(_groups);
        SetupGroupMembers(_groupMembers);

        var service = CreateService();

        var request = new SetGroupTeacherRequest
        {
            TeacherId = teacherId
        };

        // Act
        var result = await service.SetGroupTeacher(groupId, request);

        // Assert
        Assert.True(result.Succeeded);

        Assert.Single(_groupMembers);

        var teacher = _groupMembers.First();

        Assert.Equal(groupId, teacher.GroupId);
        Assert.Equal(teacherId, teacher.UserId);
        Assert.Equal(GroupRole.Teacher, teacher.Role);
    }

    [Fact]
    public async Task GetMembersGroups_ShouldReturnStudentIdsGroupedByGroupId()
    {
        // Arrange
        var group1Id = Guid.NewGuid();
        var group2Id = Guid.NewGuid();

        var student1Id = Guid.NewGuid();
        var student2Id = Guid.NewGuid();
        var teacherId = Guid.NewGuid();

        _groupMembers.AddRange(new[]
        {
            new GroupMember
            {
                Id = Guid.NewGuid(),
                GroupId = group1Id,
                UserId = student1Id,
                Role = GroupRole.Student
            },
            new GroupMember
            {
                Id = Guid.NewGuid(),
                GroupId = group1Id,
                UserId = teacherId,
                Role = GroupRole.Teacher
            },
            new GroupMember
            {
                Id = Guid.NewGuid(),
                GroupId = group2Id,
                UserId = student2Id,
                Role = GroupRole.Student
            }
        });

        SetupGroupMembers(_groupMembers);

        var service = CreateService();

        // Act
        var result = await service.GetMembersGroups(new List<Guid>
        {
            group1Id,
            group2Id
        });

        // Assert
        Assert.Equal(2, result.Count);

        Assert.Single(result[group1Id]);
        Assert.Single(result[group2Id]);

        Assert.Contains(student1Id, result[group1Id]);
        Assert.Contains(student2Id, result[group2Id]);

        Assert.DoesNotContain(teacherId, result[group1Id]);
    }

    [Fact]
    public async Task GetCourseStudentIds_WhenCuratorIdIsNull_ShouldReturnAllStudentsFromCourseGroups()
    {
        // Arrange
        var courseId = Guid.NewGuid();

        var group1Id = Guid.NewGuid();
        var group2Id = Guid.NewGuid();

        var student1Id = Guid.NewGuid();
        var student2Id = Guid.NewGuid();
        var teacherId = Guid.NewGuid();

        var group1Members = new List<GroupMember>
        {
            new()
            {
                Id = Guid.NewGuid(),
                GroupId = group1Id,
                UserId = student1Id,
                Role = GroupRole.Student
            },
            new()
            {
                Id = Guid.NewGuid(),
                GroupId = group1Id,
                UserId = teacherId,
                Role = GroupRole.Teacher
            }
        };

        var group2Members = new List<GroupMember>
        {
            new()
            {
                Id = Guid.NewGuid(),
                GroupId = group2Id,
                UserId = student2Id,
                Role = GroupRole.Student
            }
        };

        _groups.AddRange(new[]
        {
            new Group
            {
                Id = group1Id,
                CourseId = courseId,
                Title = "Группа 1",
                Members = group1Members
            },
            new Group
            {
                Id = group2Id,
                CourseId = courseId,
                Title = "Группа 2",
                Members = group2Members
            },
            new Group
            {
                Id = Guid.NewGuid(),
                CourseId = Guid.NewGuid(),
                Title = "Другая группа",
                Members = new List<GroupMember>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        UserId = Guid.NewGuid(),
                        Role = GroupRole.Student
                    }
                }
            }
        });

        SetupGroups(_groups);

        var service = CreateService();

        // Act
        var result = await service.GetCourseStudentIds(courseId);

        // Assert
        Assert.Equal(2, result.Count);

        Assert.Contains(student1Id, result);
        Assert.Contains(student2Id, result);
        Assert.DoesNotContain(teacherId, result);
    }

    [Fact]
    public async Task GetCourseStudentIds_WhenCuratorIdExists_ShouldReturnStudentsOnlyFromCuratorGroups()
    {
        // Arrange
        var courseId = Guid.NewGuid();

        var curatorId = Guid.NewGuid();

        var studentFromCuratorGroupId = Guid.NewGuid();
        var studentFromAnotherGroupId = Guid.NewGuid();

        _groups.AddRange(new[]
        {
            new Group
            {
                Id = Guid.NewGuid(),
                CourseId = courseId,
                Title = "Группа преподавателя",
                Members = new List<GroupMember>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        UserId = curatorId,
                        Role = GroupRole.Teacher
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        UserId = studentFromCuratorGroupId,
                        Role = GroupRole.Student
                    }
                }
            },
            new Group
            {
                Id = Guid.NewGuid(),
                CourseId = courseId,
                Title = "Чужая группа",
                Members = new List<GroupMember>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        UserId = studentFromAnotherGroupId,
                        Role = GroupRole.Student
                    }
                }
            }
        });

        SetupGroups(_groups);

        var service = CreateService();

        // Act
        var result = await service.GetCourseStudentIds(courseId, curatorId);

        // Assert
        Assert.Single(result);

        Assert.Contains(studentFromCuratorGroupId, result);
        Assert.DoesNotContain(studentFromAnotherGroupId, result);
    }

    [Fact]
    public async Task CreateGroupMember_WhenGroupNotFound_ShouldReturnFailure()
    {
        // Arrange
        var service = CreateService();

        var request = new CreateGroupMemberRequest
        {
            GroupId = Guid.NewGuid(),
            UserId = Guid.NewGuid(),
            Role = GroupRole.Student
        };

        // Act
        var result = await service.CreateGroupMember(request);

        // Assert
        Assert.False(result.Succeeded);
        Assert.Contains("Группа не найдена", result.Errors.First());

        Assert.Empty(_groupMembers);

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Never
        );
    }

    [Fact]
    public async Task CreateGroupMember_WhenUserAlreadyInGroup_ShouldReturnFailure()
    {
        // Arrange
        var groupId = Guid.NewGuid();
        var userId = Guid.NewGuid();

        var existingMembers = new List<GroupMember>
        {
            new()
            {
                Id = Guid.NewGuid(),
                GroupId = groupId,
                UserId = userId,
                Role = GroupRole.Student
            }
        };

        _groups.Add(new Group
        {
            Id = groupId,
            CourseId = Guid.NewGuid(),
            Title = "РИ-420934",
            Members = existingMembers
        });

        SetupGroups(_groups);

        var service = CreateService();

        var request = new CreateGroupMemberRequest
        {
            GroupId = groupId,
            UserId = userId,
            Role = GroupRole.Student
        };

        // Act
        var result = await service.CreateGroupMember(request);

        // Assert
        Assert.False(result.Succeeded);
        Assert.Contains("Пользователь уже", result.Errors.First());

        Assert.Empty(_groupMembers);

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Never
        );
    }

    [Fact]
    public async Task CreateGroupMember_WhenRequestIsValid_ShouldCreateMember()
    {
        // Arrange
        var groupId = Guid.NewGuid();
        var userId = Guid.NewGuid();

        _groups.Add(new Group
        {
            Id = groupId,
            CourseId = Guid.NewGuid(),
            Title = "РИ-420934",
            Members = new List<GroupMember>()
        });

        SetupGroups(_groups);
        SetupGroupMembers(_groupMembers);

        var service = CreateService();

        var request = new CreateGroupMemberRequest
        {
            GroupId = groupId,
            UserId = userId,
            Role = GroupRole.Student
        };

        // Act
        var result = await service.CreateGroupMember(request);

        // Assert
        Assert.True(result.Succeeded);

        Assert.Single(_groupMembers);

        var createdMember = _groupMembers.First();

        Assert.Equal(groupId, createdMember.GroupId);
        Assert.Equal(userId, createdMember.UserId);
        Assert.Equal(GroupRole.Student, createdMember.Role);
        Assert.Equal(createdMember.Id, result.Data);

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Once
        );
    }
}