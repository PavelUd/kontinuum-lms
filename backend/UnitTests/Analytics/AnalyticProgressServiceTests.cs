using Analytics.Application;
using Analytics.Application.DTO;
using Analytics.Domain;
using Analytics.Infrastructure;
using AutoMapper;
using Contracts.Contracts.Blocks;
using Contracts.Contracts.Groups;
using Contracts.Services;
using Core.Entities;
using Core.Entities.Interfaces;
using MockQueryable.Moq;
using Moq;

namespace UnitTests.Analytics;

public class AnalyticProgressServiceTests
{
    private readonly Mock<IAnalyticsDbContext> _analyticsDbContextMock = new();
    private readonly Mock<ILessonBlockStatsProvider> _lessonBlockStatsProviderMock = new();
    private readonly Mock<IGroupMembersProvider> _groupMembersProviderMock = new();
    private readonly Mock<IGroupProvider> _groupProviderMock = new();
    private readonly Mock<IIdentityUser> _identityUserMock = new();
    private readonly Mock<IUserQueryService> _userQueryServiceMock = new();
    private readonly Mock<IMapper> _mapperMock = new();

    private AnalyticProgressService CreateService()
    {
        return new AnalyticProgressService(
            _analyticsDbContextMock.Object,
            _lessonBlockStatsProviderMock.Object,
            _groupMembersProviderMock.Object,
            _identityUserMock.Object,
            _groupProviderMock.Object,
            _mapperMock.Object,
            _userQueryServiceMock.Object
        );
    }

    private void SetupLessonProgresses(List<LessonProgress> progresses)
    {
        var dbSetMock = progresses.BuildMockDbSet();

        _analyticsDbContextMock
            .Setup(x => x.LessonProgresses)
            .Returns(dbSetMock.Object);
    }

    [Fact]
    public async Task GetLessonAnalytics_ShouldReturnAverageProgressAndScore()
    {
        // Arrange
        var courseId = Guid.NewGuid();
        var lessonId = Guid.NewGuid();

        var student1 = Guid.NewGuid();
        var student2 = Guid.NewGuid();

        SetupLessonProgresses(new List<LessonProgress>
        {
            new()
            {
                CourseId = courseId,
                LessonId = lessonId,
                UserId = student1,
                Progress = 100,
                Score = 3
            },
            new()
            {
                CourseId = courseId,
                LessonId = lessonId,
                UserId = student2,
                Progress = 50,
                Score = 1
            }
        });

        _identityUserMock
            .Setup(x => x.Role)
            .Returns(Role.Admin);

        _groupMembersProviderMock
            .Setup(x => x.GetCourseStudentIds(courseId, null))
            .ReturnsAsync(new List<Guid> { student1, student2 });

        _lessonBlockStatsProviderMock
            .Setup(x => x.GetByLessonsIdAsync(It.Is<List<Guid>>(ids => ids.Contains(lessonId))))
            .ReturnsAsync(new List<LessonBlockStatsDto>
            {
                new()
                {
                    LessonId = lessonId,
                    ScoredBlocks = 4
                }
            });

        var service = CreateService();

        // Act
        var result = await service.GetLessonAnalytics(lessonId, courseId);

        // Assert
        Assert.Equal(lessonId, result.LessonId);
        Assert.Equal(2, result.StudentsCount);
        Assert.Equal(75, result.AvgProgress);
        Assert.Equal(2, result.AvgScore);
    }

    [Fact]
    public async Task GetLessonAnalytics_WhenNoStudents_ShouldReturnZeroAnalytics()
    {
        // Arrange
        var courseId = Guid.NewGuid();
        var lessonId = Guid.NewGuid();

        SetupLessonProgresses(new List<LessonProgress>());

        _identityUserMock
            .Setup(x => x.Role)
            .Returns(Role.Admin);

        _groupMembersProviderMock
            .Setup(x => x.GetCourseStudentIds(courseId, null))
            .ReturnsAsync(new List<Guid>());

        _lessonBlockStatsProviderMock
            .Setup(x => x.GetByLessonsIdAsync(It.IsAny<List<Guid>>()))
            .ReturnsAsync(new List<LessonBlockStatsDto>());

        var service = CreateService();

        // Act
        var result = await service.GetLessonAnalytics(lessonId, courseId);

        // Assert
        Assert.Equal(lessonId, result.LessonId);
        Assert.Equal(0, result.AvgProgress);
        Assert.Equal(0, result.AvgScore);
    }

    [Fact]
    public async Task GetCourseAnalytics_ShouldGroupProgressByLessons()
    {
        // Arrange
        var courseId = Guid.NewGuid();

        var lesson1 = Guid.NewGuid();
        var lesson2 = Guid.NewGuid();

        var student1 = Guid.NewGuid();
        var student2 = Guid.NewGuid();

        SetupLessonProgresses(new List<LessonProgress>
        {
            new()
            {
                CourseId = courseId,
                LessonId = lesson1,
                UserId = student1,
                Progress = 100,
                Score = 4
            },
            new()
            {
                CourseId = courseId,
                LessonId = lesson1,
                UserId = student2,
                Progress = 50,
                Score = 2
            },
            new()
            {
                CourseId = courseId,
                LessonId = lesson2,
                UserId = student1,
                Progress = 80,
                Score = 3
            }
        });

        _identityUserMock
            .Setup(x => x.Role)
            .Returns(Role.Admin);

        _groupMembersProviderMock
            .Setup(x => x.GetCourseStudentIds(courseId, null))
            .ReturnsAsync(new List<Guid> { student1, student2 });

        _lessonBlockStatsProviderMock
            .Setup(x => x.GetByLessonsIdAsync(It.IsAny<List<Guid>>()))
            .ReturnsAsync(new List<LessonBlockStatsDto>
            {
                new()
                {
                    LessonId = lesson1,
                    ScoredBlocks = 4
                },
                new()
                {
                    LessonId = lesson2,
                    ScoredBlocks = 4
                }
            });

        var service = CreateService();

        // Act
        var result = await service.GetCourseAnalytics(courseId);

        // Assert
        Assert.Equal(2, result.StudentsCount);
        Assert.Equal(2, result.Lessons.Count);

        var lesson1Analytics = result.Lessons.First(x => x.LessonId == lesson1);
        Assert.Equal(75, lesson1Analytics.AvgProgress);
        Assert.Equal(3, lesson1Analytics.AvgScore);

        var lesson2Analytics = result.Lessons.First(x => x.LessonId == lesson2);
        Assert.Equal(40, lesson2Analytics.AvgProgress);
        Assert.Equal(1.5, lesson2Analytics.AvgScore);
    }

    [Fact]
    public async Task GetGroupsAnalytics_ShouldReturnAverageProgressForEachGroup()
    {
        // Arrange
        var courseId = Guid.NewGuid();
        var lessonId = Guid.NewGuid();

        var group1 = Guid.NewGuid();
        var group2 = Guid.NewGuid();

        var student1 = Guid.NewGuid();
        var student2 = Guid.NewGuid();
        var student3 = Guid.NewGuid();

        SetupLessonProgresses(new List<LessonProgress>
        {
            new()
            {
                LessonId = lessonId,
                UserId = student1,
                Progress = 100
            },
            new()
            {
                LessonId = lessonId,
                UserId = student2,
                Progress = 50
            },
            new()
            {
                LessonId = lessonId,
                UserId = student3,
                Progress = 30
            }
        });

        _groupProviderMock
            .Setup(x => x.GetAvailableGroupsAsync(courseId))
            .ReturnsAsync(new List<GroupPreview>
            {
                new()
                {
                    Id = group1,
                    Title = "РИ-420934"
                },
                new()
                {
                    Id = group2,
                    Title = "РИ-420935"
                }
            });

        _groupMembersProviderMock
            .Setup(x => x.GetMembersGroups(It.Is<List<Guid>>(ids =>
                ids.Contains(group1) && ids.Contains(group2))))
            .ReturnsAsync(new Dictionary<Guid, List<Guid>>
            {
                [group1] = new() { student1, student2 },
                [group2] = new() { student3 }
            });

        var service = CreateService();

        // Act
        var result = await service.GetGroupsAnalytics(courseId, lessonId);

        // Assert
        Assert.Equal(2, result.Count);

        var firstGroup = result.First(x => x.Id == group1);
        Assert.Equal("РИ-420934", firstGroup.Title);
        Assert.Equal(75, firstGroup.AvgProgress);

        var secondGroup = result.First(x => x.Id == group2);
        Assert.Equal("РИ-420935", secondGroup.Title);
        Assert.Equal(30, secondGroup.AvgProgress);
    }

    [Fact]
    public async Task GroupMembersProgress_ShouldReturnProgressForEveryMember()
    {
        // Arrange
        var groupId = Guid.NewGuid();
        var lessonId = Guid.NewGuid();

        var student1 = Guid.NewGuid();
        var student2 = Guid.NewGuid();
        var student3 = Guid.NewGuid();

        SetupLessonProgresses(new List<LessonProgress>
        {
            new()
            {
                LessonId = lessonId,
                UserId = student1,
                Progress = 100
            },
            new()
            {
                LessonId = lessonId,
                UserId = student2,
                Progress = 40.5
            }
        });

        _groupMembersProviderMock
            .Setup(x => x.GetMembersGroups(It.Is<List<Guid>>(ids => ids.Contains(groupId))))
            .ReturnsAsync(new Dictionary<Guid, List<Guid>>
            {
                [groupId] = new() { student1, student2, student3 }
            });

        _userQueryServiceMock
            .Setup(x => x.GetUsersDictionary(It.IsAny<List<Guid>>()))
            .ReturnsAsync(new Dictionary<Guid, string>
            {
                [student1] = "Иванов Иван",
                [student2] = "Петров Петр",
                [student3] = "Сидоров Сидор"
            });

        var service = CreateService();

        // Act
        var result = await service.GroupMembersProgress(groupId, lessonId);

        // Assert
        Assert.Equal(3, result.Count);

        var firstStudent = result.First(x => x.Id == student1);
        Assert.Equal("Иванов Иван", firstStudent.Name);
        Assert.Equal(100, firstStudent.Progress);

        var secondStudent = result.First(x => x.Id == student2);
        Assert.Equal("Петров Петр", secondStudent.Name);
        Assert.Equal(40.5, secondStudent.Progress);

        var thirdStudent = result.First(x => x.Id == student3);
        Assert.Equal("Сидоров Сидор", thirdStudent.Name);
        Assert.Equal(0, thirdStudent.Progress);
    }

    [Fact]
    public async Task GetLessonAnalytics_ForTeacher_ShouldFilterStudentsByTeacherId()
    {
        // Arrange
        var courseId = Guid.NewGuid();
        var lessonId = Guid.NewGuid();

        var teacherId = Guid.NewGuid();
        var studentId = Guid.NewGuid();

        SetupLessonProgresses(new List<LessonProgress>
        {
            new()
            {
                CourseId = courseId,
                LessonId = lessonId,
                UserId = studentId,
                Progress = 100,
                Score = 5
            }
        });

        _identityUserMock
            .Setup(x => x.Role)
            .Returns(Role.Teacher);

        _identityUserMock
            .Setup(x => x.Id)
            .Returns(teacherId);

        _groupMembersProviderMock
            .Setup(x => x.GetCourseStudentIds(courseId, teacherId))
            .ReturnsAsync(new List<Guid> { studentId });

        _lessonBlockStatsProviderMock
            .Setup(x => x.GetByLessonsIdAsync(It.IsAny<List<Guid>>()))
            .ReturnsAsync(new List<LessonBlockStatsDto>
            {
                new()
                {
                    LessonId = lessonId,
                    ScoredBlocks = 5
                }
            });

        var service = CreateService();

        // Act
        var result = await service.GetLessonAnalytics(lessonId, courseId);

        // Assert
        Assert.Equal(100, result.AvgProgress);
        Assert.Equal(5, result.AvgScore);

        _groupMembersProviderMock.Verify(
            x => x.GetCourseStudentIds(courseId, teacherId),
            Times.Once
        );
    }
}