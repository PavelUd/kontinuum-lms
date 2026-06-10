using AutoMapper;
using Contracts.Contracts.Users;
using Microsoft.EntityFrameworkCore;
using MockQueryable.Moq;
using Moq;
using Users.Application;
using Users.Application.DTO;
using Users.Application.Helpers;
using Users.Domain;
using Users.Infrastructure;

namespace UnitTests.Users;

public class UsersServiceTests
{
    private readonly Mock<IUsersDbContext> _contextMock = new();
    private readonly IMapper _mapper;

    private readonly List<User> _users = new();

    public UsersServiceTests()
    {
        var mapperConfig = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<User, UserAuthDto>();
            cfg.CreateMap<User, UserDto>();

            cfg.CreateMap<CreateStudentRequest, User>();
            cfg.CreateMap<CreateEmployeeDto, User>();
        });

        _mapper = mapperConfig.CreateMapper();

        SetupUsers(_users);

        _contextMock
            .Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        _contextMock
            .Setup(x => x.SaveChangesAsync())
            .ReturnsAsync(1);
    }

    private UsersService CreateService()
    {
        return new UsersService(
            _contextMock.Object,
            _mapper
        );
    }

    private void SetupUsers(List<User> users)
    {
        var dbSetMock = users
            .BuildMockDbSet();

        dbSetMock
            .Setup(x => x.Add(It.IsAny<User>()))
            .Callback<User>(users.Add);

        dbSetMock
            .Setup(x => x.Remove(It.IsAny<User>()))
            .Callback<User>(user => users.Remove(user));

        _contextMock
            .Setup(x => x.Users)
            .Returns(dbSetMock.Object);
    }

    [Fact]
    public async Task GetAuthUserByPhoneAsync_WhenUserExists_ShouldReturnUser()
    {
        // Arrange
        var userId = Guid.NewGuid();

        _users.Add(new User
        {
            Id = userId,
            FullName = "Иванов Иван",
            Phone = "79990000000",
            Status = UserStatus.Active
        });

        SetupUsers(_users);

        var service = CreateService();

        // Act
        var result = await service.GetAuthUserByPhoneAsync("79990000000");

        // Assert
        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.Equal(userId, result.Data.Id);
        Assert.Equal("79990000000", result.Data.Phone);
    }

    [Fact]
    public async Task GetAuthUserByPhoneAsync_WhenUserNotFound_ShouldReturnFailure()
    {
        // Arrange
        var service = CreateService();

        // Act
        var result = await service.GetAuthUserByPhoneAsync("79990000000");

        // Assert
        Assert.False(result.Succeeded);
        Assert.Contains("User not found", result.Errors.First());
    }

    [Fact]
    public async Task GetUserById_WhenUserExists_ShouldReturnUser()
    {
        // Arrange
        var userId = Guid.NewGuid();

        _users.Add(new User
        {
            Id = userId,
            FullName = "Петров Петр",
            Phone = "79991111111",
            Status = UserStatus.Active
        });

        SetupUsers(_users);

        var service = CreateService();

        // Act
        var result = await service.GetUserById<UserDto>(userId);

        // Assert
        Assert.True(result.Succeeded);
        Assert.NotNull(result.Data);
        Assert.Equal(userId, result.Data.Id);
        Assert.Equal("Петров Петр", result.Data.FullName);
    }

    [Fact]
    public async Task GetUserById_WhenUserNotFound_ShouldReturnSuccessWithNull()
    {
        // Arrange
        var service = CreateService();

        // Act
        var result = await service.GetUserById<UserDto>(Guid.NewGuid());

        // Assert
        Assert.True(result.Succeeded);
        Assert.Null(result.Data);
    }

    [Fact]
    public async Task CreateUser_WhenRequestIsValid_ShouldCreateUser()
    {
        // Arrange
        var service = CreateService();

        var request = new CreateStudentRequest
        {
            FullName = "Иванов Иван",
            Phone = "+7 (999) 000-00-00"
        };

        // Act
        var result = await service.CreateUser(request);

        // Assert
        Assert.Single(_users);

        var createdUser = _users.First();

        Assert.Equal(createdUser.Id, result);
        Assert.Equal("Иванов Иван", createdUser.FullName);
        Assert.Equal(UserStatus.Invited, createdUser.Status);

        Assert.Equal(
            PhoneHelper.NormalizePhone("+7 (999) 000-00-00"),
            createdUser.Phone
        );

        _contextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Once
        );
    }

    [Fact]
    public async Task CreateUser_WhenPhoneAlreadyExists_ShouldThrowException()
    {
        // Arrange
        var phone = PhoneHelper.NormalizePhone("+7 (999) 000-00-00");

        _users.Add(new User
        {
            Id = Guid.NewGuid(),
            FullName = "Иванов Иван",
            Phone = phone,
            Status = UserStatus.Active
        });

        SetupUsers(_users);

        var service = CreateService();

        var request = new CreateStudentRequest
        {
            FullName = "Петров Петр",
            Phone = "+7 (999) 000-00-00"
        };

        // Act
        var exception = await Assert.ThrowsAsync<Exception>(() =>
            service.CreateUser(request)
        );

        // Assert
        Assert.Equal(
            "Пользователь с таким номером уже существует",
            exception.Message
        );

        Assert.Single(_users);

        _contextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Never
        );
    }

    [Fact]
    public async Task CreateUser_WhenSaveChangesThrowsDbUpdateException_ShouldThrowDuplicatePhoneException()
    {
        // Arrange
        var service = CreateService();

        var request = new CreateStudentRequest
        {
            FullName = "Иванов Иван",
            Phone = "+7 (999) 000-00-00"
        };

        _contextMock
            .Setup(x => x.SaveChangesAsync())
            .ThrowsAsync(new DbUpdateException());

        // Act
        var exception = await Assert.ThrowsAsync<Exception>(() =>
            service.CreateUser(request)
        );

        // Assert
        Assert.Equal(
            "Пользователь с таким номером уже существует",
            exception.Message
        );
    }

    [Fact]
    public async Task SetStatus_WhenUserNotFound_ShouldReturnFailure()
    {
        // Arrange
        var service = CreateService();

        // Act
        var result = await service.SetStatus(
            Guid.NewGuid(),
            UserStatus.Active
        );

        // Assert
        Assert.False(result.Succeeded);
        Assert.Contains("Пользователь не найден", result.Errors.First());

        _contextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Never
        );
    }

    [Fact]
    public async Task SetStatus_WhenUserExists_ShouldUpdateStatus()
    {
        // Arrange
        var userId = Guid.NewGuid();

        var user = new User
        {
            Id = userId,
            FullName = "Иванов Иван",
            Phone = "79990000000",
            Status = UserStatus.Invited
        };

        _users.Add(user);

        SetupUsers(_users);

        var service = CreateService();

        // Act
        var result = await service.SetStatus(
            userId,
            UserStatus.Active
        );

        // Assert
        Assert.True(result.Succeeded);
        Assert.Equal(UserStatus.Active, user.Status);

        _contextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Once
        );
    }

    [Fact]
    public async Task SetStatus_WhenSaveChangesThrowsDbUpdateException_ShouldReturnFailure()
    {
        // Arrange
        var userId = Guid.NewGuid();

        _users.Add(new User
        {
            Id = userId,
            FullName = "Иванов Иван",
            Phone = "79990000000",
            Status = UserStatus.Invited
        });

        SetupUsers(_users);

        _contextMock
            .Setup(x => x.SaveChangesAsync())
            .ThrowsAsync(new DbUpdateException());

        var service = CreateService();

        // Act
        var result = await service.SetStatus(
            userId,
            UserStatus.Active
        );

        // Assert
        Assert.False(result.Succeeded);
        Assert.Contains("Ошибка бд", result.Errors.First());
    }

    [Fact]
    public async Task RemoveUser_WhenUserNotFound_ShouldReturnSuccessWithoutSaving()
    {
        // Arrange
        var service = CreateService();

        // Act
        var result = await service.RemoveUser(Guid.NewGuid());

        // Assert
        Assert.True(result.Succeeded);

        _contextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Never
        );
    }

    [Fact]
    public async Task RemoveUser_WhenUserExists_ShouldRemoveUser()
    {
        // Arrange
        var userId = Guid.NewGuid();

        _users.Add(new User
        {
            Id = userId,
            FullName = "Иванов Иван",
            Phone = "79990000000",
            Status = UserStatus.Active
        });

        SetupUsers(_users);

        var service = CreateService();

        // Act
        var result = await service.RemoveUser(userId);

        // Assert
        Assert.True(result.Succeeded);
        Assert.Empty(_users);

        _contextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Once
        );
    }

    [Fact]
    public async Task RemoveUser_WhenSaveChangesThrowsException_ShouldReturnFailure()
    {
        // Arrange
        var userId = Guid.NewGuid();

        _users.Add(new User
        {
            Id = userId,
            FullName = "Иванов Иван",
            Phone = "79990000000",
            Status = UserStatus.Active
        });

        SetupUsers(_users);

        _contextMock
            .Setup(x => x.SaveChangesAsync())
            .ThrowsAsync(new Exception("Database error"));

        var service = CreateService();

        // Act
        var result = await service.RemoveUser(userId);

        // Assert
        Assert.False(result.Succeeded);
        Assert.Contains("Database error", result.Errors.First());
    }

    [Fact]
    public async Task GetUsersDictionary_WhenIdsIsNull_ShouldReturnEmptyDictionary()
    {
        // Arrange
        var service = CreateService();

        // Act
        var result = await service.GetUsersDictionary(null!);

        // Assert
        Assert.Empty(result);
    }

    [Fact]
    public async Task GetUsersDictionary_WhenIdsIsEmpty_ShouldReturnEmptyDictionary()
    {
        // Arrange
        var service = CreateService();

        // Act
        var result = await service.GetUsersDictionary(new List<Guid>());

        // Assert
        Assert.Empty(result);
    }

    [Fact]
    public async Task GetUsersDictionary_ShouldReturnOnlyRequestedUsers()
    {
        // Arrange
        var user1Id = Guid.NewGuid();
        var user2Id = Guid.NewGuid();
        var user3Id = Guid.NewGuid();

        _users.AddRange(new[]
        {
            new User
            {
                Id = user1Id,
                FullName = "Иванов Иван",
                Phone = "79990000000",
                Status = UserStatus.Active
            },
            new User
            {
                Id = user2Id,
                FullName = "Петров Петр",
                Phone = "79991111111",
                Status = UserStatus.Active
            },
            new User
            {
                Id = user3Id,
                FullName = "Сидоров Сидор",
                Phone = "79992222222",
                Status = UserStatus.Active
            }
        });

        SetupUsers(_users);

        var service = CreateService();

        // Act
        var result = await service.GetUsersDictionary(new List<Guid>
        {
            user1Id,
            user3Id
        });

        // Assert
        Assert.Equal(2, result.Count);

        Assert.Equal("Иванов Иван", result[user1Id]);
        Assert.Equal("Сидоров Сидор", result[user3Id]);
        Assert.False(result.ContainsKey(user2Id));
    }
}