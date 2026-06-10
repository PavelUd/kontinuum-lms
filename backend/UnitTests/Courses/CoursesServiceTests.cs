using Contracts.Services;
using Core.Entities;
using Core.Entities.Interfaces;
using Courses.Application;
using Courses.Domain.Entities;
using Courses.Domain.Enums;
using Courses.DTO.Courses;
using Courses.Infrastructure.Interfaces;

namespace UnitTests.Courses;

using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MockQueryable.Moq;
using Moq;
using Xunit;

public class CoursesServiceTests
{
    private readonly Mock<ICoursesDbContext> _dbContextMock = new();
    private readonly Mock<IIdentityUser> _currentUserMock = new();
    private readonly Mock<ICourseAccessService> _accessServiceMock = new();

    private readonly IMapper _mapper;

    private readonly List<Course> _courses = new();
    private readonly List<Lesson> _lessons = new();

    public CoursesServiceTests()
    {
        var mapperConfig = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<CourseCreateRequest, Course>();

            cfg.CreateMap<Course, SummaryCourseDto>();
            cfg.CreateMap<Course, CourseLookup>();
        });

        _mapper = mapperConfig.CreateMapper();

        SetupIdentityUser(Role.Admin);
        SetupCourses(_courses);
        SetupLessons(_lessons);

        _dbContextMock
            .Setup(x => x.SaveChanges())
            .Returns(1);

        _dbContextMock
            .Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);
    }

    private CoursesService CreateService()
    {
        return new CoursesService(
            _dbContextMock.Object,
            _mapper,
            _currentUserMock.Object,
            _accessServiceMock.Object
        );
    }

    private void SetupIdentityUser(Role role, Guid? userId = null)
    {
        _currentUserMock
            .Setup(x => x.Role)
            .Returns(role);

        _currentUserMock
            .Setup(x => x.Id)
            .Returns(userId ?? Guid.NewGuid());
    }

    private void SetupCourses(List<Course> courses)
    {
        var dbSetMock = courses
            .BuildMockDbSet();

        dbSetMock
            .Setup(x => x.Add(It.IsAny<Course>()))
            .Callback<Course>(courses.Add);

        dbSetMock
            .Setup(x => x.Remove(It.IsAny<Course>()))
            .Callback<Course>(course => courses.Remove(course));

        _dbContextMock
            .Setup(x => x.Courses)
            .Returns(dbSetMock.Object);
    }

    private void SetupLessons(List<Lesson> lessons)
    {
        var dbSetMock = lessons
            .BuildMockDbSet();

        _dbContextMock
            .Setup(x => x.Lessons)
            .Returns(dbSetMock.Object);
    }

    [Fact]
    public void CreateCourse_WhenNameIsEmpty_ShouldReturnFailure()
    {
        // Arrange
        var service = CreateService();

        var request = new CourseCreateRequest
        {
            Name = ""
        };

        // Act
        var result = service.CreateCourse(request);

        // Assert
        Assert.False(result.Succeeded);
        Assert.Contains("оне может быть пустым", result.Errors.First());

        Assert.Empty(_courses);

        _dbContextMock.Verify(
            x => x.SaveChanges(),
            Times.Never
        );
    }

    [Fact]
    public void CreateCourse_WhenNameContainsOnlySpaces_ShouldReturnFailure()
    {
        // Arrange
        var service = CreateService();

        var request = new CourseCreateRequest
        {
            Name = "     "
        };

        // Act
        var result = service.CreateCourse(request);

        // Assert
        Assert.False(result.Succeeded);
        Assert.Empty(_courses);

        _dbContextMock.Verify(
            x => x.SaveChanges(),
            Times.Never
        );
    }

    [Fact]
    public void CreateCourse_WhenCourseNameAlreadyExists_ShouldReturnFailure()
    {
        // Arrange
        _courses.Add(new Course
        {
            Id = Guid.NewGuid(),
            Name = "Математика",
            Status = Status.Active
        });

        SetupCourses(_courses);

        var service = CreateService();

        var request = new CourseCreateRequest
        {
            Name = "Математика"
        };

        // Act
        var result = service.CreateCourse(request);

        // Assert
        Assert.False(result.Succeeded);
        Assert.Contains("уже существует", result.Errors.First());

        Assert.Single(_courses);

        _dbContextMock.Verify(
            x => x.SaveChanges(),
            Times.Never
        );
    }

    [Fact]
    public void CreateCourse_WhenCourseNameAlreadyExistsWithDifferentCase_ShouldReturnFailure()
    {
        // Arrange
        _courses.Add(new Course
        {
            Id = Guid.NewGuid(),
            Name = "Математика",
            Status = Status.Active
        });

        SetupCourses(_courses);

        var service = CreateService();

        var request = new CourseCreateRequest
        {
            Name = "математика"
        };

        // Act
        var result = service.CreateCourse(request);

        // Assert
        Assert.False(result.Succeeded);
        Assert.Single(_courses);

        _dbContextMock.Verify(
            x => x.SaveChanges(),
            Times.Never
        );
    }

    [Fact]
    public void CreateCourse_WhenRequestIsValid_ShouldCreateCourse()
    {
        // Arrange
        var service = CreateService();

        var request = new CourseCreateRequest
        {
            Name = "Информатика"
        };

        // Act
        var result = service.CreateCourse(request);

        // Assert
        Assert.True(result.Succeeded);
        Assert.Single(_courses);

        var createdCourse = _courses.First();

        Assert.Equal("Информатика", createdCourse.Name);
        Assert.Equal(createdCourse.Id, result.Data);

        _dbContextMock.Verify(
            x => x.SaveChanges(),
            Times.Once
        );
    }

    [Fact]
    public async Task DeleteCourse_WhenCourseNotFound_ShouldReturnFailure()
    {
        // Arrange
        var service = CreateService();

        var courseId = Guid.NewGuid();

        // Act
        var result = await service.DeleteCourse(courseId);

        // Assert
        Assert.False(result.Succeeded);
        Assert.Contains("Course not found", result.Errors.First());

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never
        );
    }

    [Fact]
    public async Task DeleteCourse_WhenCourseExists_ShouldRemoveCourse()
    {
        // Arrange
        var courseId = Guid.NewGuid();

        _courses.Add(new Course
        {
            Id = courseId,
            Name = "Математика",
            Status = Status.Active
        });

        SetupCourses(_courses);

        var service = CreateService();

        // Act
        var result = await service.DeleteCourse(courseId);

        // Assert
        Assert.True(result.Succeeded);
        Assert.Empty(_courses);

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once
        );
    }

    [Fact]
    public async Task SetStatus_WhenCourseNotFound_ShouldReturnFailure()
    {
        // Arrange
        var service = CreateService();

        var courseId = Guid.NewGuid();

        // Act
        var result = await service.SetStatus(Status.Active, courseId);

        // Assert
        Assert.False(result.Succeeded);
        Assert.Contains("Course not found", result.Errors.First());

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never
        );
    }

    [Fact]
    public async Task SetStatus_WhenCourseExists_ShouldChangeStatus()
    {
        // Arrange
        var courseId = Guid.NewGuid();

        var course = new Course
        {
            Id = courseId,
            Name = "Математика",
            Status = Status.Draft
        };

        _courses.Add(course);

        SetupCourses(_courses);

        var service = CreateService();

        // Act
        var result = await service.SetStatus(Status.Active, courseId);

        // Assert
        Assert.True(result.Succeeded);
        Assert.Equal(Status.Active, course.Status);

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once
        );
    }

    [Fact]
    public async Task GetMyCourses_ShouldReturnOnlyActiveAccessibleCourses()
    {
        // Arrange
        var userId = Guid.NewGuid();

        SetupIdentityUser(Role.Student, userId);

        var accessibleCourseId = Guid.NewGuid();
        var inactiveCourseId = Guid.NewGuid();
        var notAccessibleCourseId = Guid.NewGuid();

        _courses.AddRange(new[]
        {
            new Course
            {
                Id = accessibleCourseId,
                Name = "Активный доступный курс",
                Status = Status.Active
            },
            new Course
            {
                Id = inactiveCourseId,
                Name = "Архивный доступный курс",
                Status = Status.Archived
            },
            new Course
            {
                Id = notAccessibleCourseId,
                Name = "Недоступный курс",
                Status = Status.Active
            }
        });

        SetupCourses(_courses);

        _accessServiceMock
            .Setup(x => x.GetAccessibleCourseIds(userId))
            .ReturnsAsync(new List<Guid>
            {
                accessibleCourseId,
                inactiveCourseId
            });

        var service = CreateService();

        // Act
        var result = await service.GetMyCourses();

        // Assert
        Assert.True(result.Succeeded);
        Assert.Single(result.Data);

        Assert.Equal(accessibleCourseId, result.Data.First().Id);
    }

    [Fact]
    public async Task GetCourses_WhenUserIsTeacher_ShouldReturnOnlyAccessibleCourses()
    {
        // Arrange
        var teacherId = Guid.NewGuid();

        SetupIdentityUser(Role.Teacher, teacherId);

        var accessibleCourseId = Guid.NewGuid();
        var notAccessibleCourseId = Guid.NewGuid();

        _courses.AddRange(new[]
        {
            new Course
            {
                Id = accessibleCourseId,
                Name = "Доступный курс",
                Status = Status.Active
            },
            new Course
            {
                Id = notAccessibleCourseId,
                Name = "Недоступный курс",
                Status = Status.Active
            }
        });

        SetupCourses(_courses);

        _accessServiceMock
            .Setup(x => x.GetAccessibleCourseIds(teacherId))
            .ReturnsAsync(new List<Guid>
            {
                accessibleCourseId
            });

        var service = CreateService();

        // Act
        var result = await service.GetCourses();

        // Assert
        Assert.True(result.Succeeded);
        Assert.Single(result.Data);

        Assert.Equal(accessibleCourseId, result.Data.First().Id);

        _accessServiceMock.Verify(
            x => x.GetAccessibleCourseIds(teacherId),
            Times.Once
        );
    }

    [Fact]
    public async Task GetCourses_WhenUserIsAdmin_ShouldReturnAllCourses()
    {
        // Arrange
        SetupIdentityUser(Role.Admin);

        _courses.AddRange(new[]
        {
            new Course
            {
                Id = Guid.NewGuid(),
                Name = "Курс 1",
                Status = Status.Active
            },
            new Course
            {
                Id = Guid.NewGuid(),
                Name = "Курс 2",
                Status = Status.Archived
            }
        });

        SetupCourses(_courses);

        var service = CreateService();

        // Act
        var result = await service.GetCourses();

        // Assert
        Assert.True(result.Succeeded);
        Assert.Equal(2, result.Data.Count);

        _accessServiceMock.Verify(
            x => x.GetAccessibleCourseIds(It.IsAny<Guid>()),
            Times.Never
        );
    }

    [Fact]
    public async Task GetCourseLookup_ShouldReturnOnlyActiveCourses()
    {
        // Arrange
        _courses.AddRange(new[]
        {
            new Course
            {
                Id = Guid.NewGuid(),
                Name = "Активный курс",
                Status = Status.Active
            },
            new Course
            {
                Id = Guid.NewGuid(),
                Name = "Архивный курс",
                Status = Status.Archived
            }
        });

        SetupCourses(_courses);

        var service = CreateService();

        // Act
        var result = await service.GetCourseLookup();

        // Assert
        Assert.Single(result);
        Assert.Equal("Активный курс", result.First().Name);
    }

    [Fact]
    public async Task GetCourseDictionary_ShouldReturnDictionaryByIds()
    {
        // Arrange
        var course1Id = Guid.NewGuid();
        var course2Id = Guid.NewGuid();
        var course3Id = Guid.NewGuid();

        _courses.AddRange(new[]
        {
            new Course
            {
                Id = course1Id,
                Name = "Курс 1",
                Status = Status.Active
            },
            new Course
            {
                Id = course2Id,
                Name = "Курс 2",
                Status = Status.Active
            },
            new Course
            {
                Id = course3Id,
                Name = "Курс 3",
                Status = Status.Active
            }
        });

        SetupCourses(_courses);

        var service = CreateService();

        // Act
        var result = await service.GetCourseDictionary(new List<Guid>
        {
            course1Id,
            course3Id
        });

        // Assert
        Assert.Equal(2, result.Count);

        Assert.Equal("Курс 1", result[course1Id]);
        Assert.Equal("Курс 3", result[course3Id]);
        Assert.False(result.ContainsKey(course2Id));
    }

    [Fact]
    public void GetLessonCountsByCourseIds_ShouldReturnActiveLessonsCountGroupedByCourse()
    {
        // Arrange
        var course1Id = Guid.NewGuid();
        var course2Id = Guid.NewGuid();

        _lessons.AddRange(new[]
        {
            new Lesson
            {
                Id = Guid.NewGuid(),
                CourseId = course1Id,
                Status = Status.Active
            },
            new Lesson
            {
                Id = Guid.NewGuid(),
                CourseId = course1Id,
                Status = Status.Active
            },
            new Lesson
            {
                Id = Guid.NewGuid(),
                CourseId = course1Id,
                Status = Status.Archived
            },
            new Lesson
            {
                Id = Guid.NewGuid(),
                CourseId = course2Id,
                Status = Status.Active
            }
        });

        SetupLessons(_lessons);

        var service = CreateService();

        // Act
        var result = service.GetLessonCountsByCourseIds(Guid.NewGuid());

        // Assert
        Assert.Equal(2, result[course1Id]);
        Assert.Equal(1, result[course2Id]);
    }
}