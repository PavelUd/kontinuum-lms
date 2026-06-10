using AutoMapper;
using Courses.Application;
using Courses.Domain.Entities;
using Courses.Domain.Enums;
using Courses.DTO.Lessons;
using Courses.Infrastructure.Interfaces;
using MockQueryable.Moq;
using Moq;

namespace UnitTests.Courses;

public class LessonsServiceTests
{
    private readonly Mock<ICoursesDbContext> _dbContextMock = new();

    private readonly IMapper _mapper;

    private readonly List<Course> _courses = new();
    private readonly List<Lesson> _lessons = new();

    public LessonsServiceTests()
    {
        var mapperConfig = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<LessonCreateRequest, Lesson>()
                .ForMember(
                    dest => dest.Title,
                    opt => opt.MapFrom(src => src.Title!.Trim())
                );

            cfg.CreateMap<PatchLessonRequest, Lesson>()
                .ForAllMembers(opt =>
                    opt.Condition((src, dest, srcMember) => srcMember != null));

            cfg.CreateMap<Lesson, SummaryLessonDto>();
        });

        _mapper = mapperConfig.CreateMapper();

        SetupCourses(_courses);
        SetupLessons(_lessons);

        _dbContextMock
            .Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        _dbContextMock
            .Setup(x => x.SaveChangesAsync())
            .ReturnsAsync(1);
    }

    private LessonsService CreateService()
    {
        return new LessonsService(
            _dbContextMock.Object,
            _mapper
        );
    }

    private void SetupCourses(List<Course> courses)
    {
        var dbSetMock = courses
            .BuildMockDbSet();

        _dbContextMock
            .Setup(x => x.Courses)
            .Returns(dbSetMock.Object);
    }

    private void SetupLessons(List<Lesson> lessons)
    {
        var dbSetMock = lessons
            .BuildMockDbSet();

        dbSetMock
            .Setup(x => x.Add(It.IsAny<Lesson>()))
            .Callback<Lesson>(lessons.Add);

        dbSetMock
            .Setup(x => x.Remove(It.IsAny<Lesson>()))
            .Callback<Lesson>(lesson => lessons.Remove(lesson));

        _dbContextMock
            .Setup(x => x.Lessons)
            .Returns(dbSetMock.Object);
    } 

    [Fact]
    public async Task PatchLesson_WhenLessonNotFound_ShouldReturnFailure()
    {
        // Arrange
        var service = CreateService();

        var request = new PatchLessonRequest
        {
            Title = "Новое название"
        };

        // Act
        var result = await service.PatchLesson(Guid.NewGuid(), request);

        // Assert
        Assert.False(result.Succeeded);
        Assert.Contains("Lesson not found", result.Errors.First());

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Never
        );
    }

    [Fact]
    public async Task PatchLesson_WhenTitleIsEmpty_ShouldReturnFailure()
    {
        // Arrange
        var lessonId = Guid.NewGuid();

        _lessons.Add(new Lesson
        {
            Id = lessonId,
            CourseId = Guid.NewGuid(),
            Title = "Старое название",
            Status = Status.Active
        });

        SetupLessons(_lessons);

        var service = CreateService();

        var request = new PatchLessonRequest
        {
            Title = ""
        };

        // Act
        var result = await service.PatchLesson(lessonId, request);

        // Assert
        Assert.False(result.Succeeded);

        Assert.Equal("Старое название", _lessons.First().Title);

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Never
        );
    }

    [Fact]
    public async Task PatchLesson_WhenTitleAlreadyExistsInSameCourse_ShouldReturnFailure()
    {
        // Arrange
        var courseId = Guid.NewGuid();

        var lessonId = Guid.NewGuid();

        _lessons.AddRange(new[]
        {
            new Lesson
            {
                Id = lessonId,
                CourseId = courseId,
                Title = "Тема 1",
                Status = Status.Active
            },
            new Lesson
            {
                Id = Guid.NewGuid(),
                CourseId = courseId,
                Title = "Тема 2",
                Status = Status.Active
            }
        });

        SetupLessons(_lessons);

        var service = CreateService();

        var request = new PatchLessonRequest
        {
            Title = "Тема 2"
        };

        // Act
        var result = await service.PatchLesson(lessonId, request);

        // Assert
        Assert.False(result.Succeeded);
        Assert.Contains("already exists", result.Errors.First());

        Assert.Equal("Тема 1", _lessons.First(x => x.Id == lessonId).Title);

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Never
        );
    }

    [Fact]
    public async Task PatchLesson_WhenTitleIsSameAsCurrent_ShouldReturnSuccess()
    {
        // Arrange
        var lessonId = Guid.NewGuid();

        _lessons.Add(new Lesson
        {
            Id = lessonId,
            CourseId = Guid.NewGuid(),
            Title = "Тема 1",
            Status = Status.Active
        });

        SetupLessons(_lessons);

        var service = CreateService();

        var request = new PatchLessonRequest
        {
            Title = "Тема 1"
        };

        // Act
        var result = await service.PatchLesson(lessonId, request);

        // Assert
        Assert.True(result.Succeeded);

        Assert.Equal("Тема 1", _lessons.First().Title);

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Once
        );
    }

    [Fact]
    public async Task SetLessonStatus_WhenLessonNotFound_ShouldReturnFailure()
    {
        // Arrange
        var service = CreateService();

        // Act
        var result = await service.SetLessonStatus(
            Guid.NewGuid(),
            Status.Active
        );

        // Assert
        Assert.False(result.Succeeded);
        Assert.Contains("Lesson not found", result.Errors.First());

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Never
        );
    }

    [Fact]
    public async Task SetLessonStatus_WhenCourseIsArchived_ShouldReturnFailure()
    {
        // Arrange
        var courseId = Guid.NewGuid();
        var lessonId = Guid.NewGuid();

        _courses.Add(new Course
        {
            Id = courseId,
            Name = "Курс",
            Status = Status.Archived
        });

        _lessons.Add(new Lesson
        {
            Id = lessonId,
            CourseId = courseId,
            Title = "Урок",
            Status = Status.Draft
        });

        SetupCourses(_courses);
        SetupLessons(_lessons);

        var service = CreateService();

        // Act
        var result = await service.SetLessonStatus(
            lessonId,
            Status.Active
        );

        // Assert
        Assert.False(result.Succeeded);
        Assert.Contains("Cannot activate lesson", result.Errors.First());

        Assert.Equal(Status.Draft, _lessons.First().Status);

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Never
        );
    }

    [Fact]
    public async Task SetLessonStatus_WhenRequestIsValid_ShouldUpdateStatus()
    {
        // Arrange
        var courseId = Guid.NewGuid();
        var lessonId = Guid.NewGuid();

        _courses.Add(new Course
        {
            Id = courseId,
            Name = "Курс",
            Status = Status.Active
        });

        _lessons.Add(new Lesson
        {
            Id = lessonId,
            CourseId = courseId,
            Title = "Урок",
            Status = Status.Draft
        });

        SetupCourses(_courses);
        SetupLessons(_lessons);

        var service = CreateService();

        // Act
        var result = await service.SetLessonStatus(
            lessonId,
            Status.Active
        );

        // Assert
        Assert.True(result.Succeeded);

        Assert.Equal(Status.Active, _lessons.First().Status);

        _dbContextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Once
        );
    }

    [Fact]
    public async Task GetByLessonIdAsync_WhenLessonExists_ShouldReturnCourseId()
    {
        // Arrange
        var courseId = Guid.NewGuid();
        var lessonId = Guid.NewGuid();

        _lessons.Add(new Lesson
        {
            Id = lessonId,
            CourseId = courseId,
            Title = "Урок",
            Status = Status.Active
        });

        SetupLessons(_lessons);

        var service = CreateService();

        // Act
        var result = await service.GetByLessonIdAsync(lessonId);

        // Assert
        Assert.Equal(courseId, result);
    }

    [Fact]
    public async Task GetByLessonIdAsync_WhenLessonNotFound_ShouldReturnNull()
    {
        // Arrange
        var service = CreateService();

        // Act
        var result = await service.GetByLessonIdAsync(Guid.NewGuid());

        // Assert
        Assert.Null(result);
    }
}