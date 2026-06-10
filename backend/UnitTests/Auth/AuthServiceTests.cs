using System.Security.Cryptography;
using Auth.Application;
using Auth.Application.Interfaces;
using Auth.Domain;
using Auth.Infrastructure;
using Contracts.Contracts.Users;
using Contracts.Services;
using Core;
using Core.Entities;
using Microsoft.Extensions.Options;
using MockQueryable.Moq;
using Moq;

namespace UnitTests.Auth;

public class AuthServiceTests
{
    private readonly Mock<IAuthDbContext> _contextMock = new();
    private readonly Mock<IHashingService> _hashingServiceMock = new();
    private readonly Mock<IUserQueryService> _userQueryServiceMock = new();

    private readonly List<Credential> _credentials = new();
    private readonly List<RefreshSession> _refreshSessions = new();

    public AuthServiceTests()
    {
        SetupCredentials(_credentials);
        SetupRefreshSessions(_refreshSessions);

        _contextMock
            .Setup(x => x.SaveChangesAsync())
            .ReturnsAsync(1);
    }

    private AuthService CreateService()
    {
        var tokenOptions = Options.Create(new Token
        {
            Secret = "super-secret-key-for-tests-1234567890"
        });

        return new AuthService(
            tokenOptions,
            _contextMock.Object,
            _hashingServiceMock.Object,
            _userQueryServiceMock.Object
        );
    }

    private void SetupCredentials(List<Credential> credentials)
    {
        var dbSetMock = credentials
            .BuildMockDbSet();

        _contextMock
            .Setup(x => x.Credentials)
            .Returns(dbSetMock.Object);
    }

    private void SetupRefreshSessions(List<RefreshSession> sessions)
    {
        var dbSetMock = sessions
            .BuildMockDbSet();

        dbSetMock
            .Setup(x => x.AddAsync(
                It.IsAny<RefreshSession>(),
                It.IsAny<CancellationToken>()))
            .Callback<RefreshSession, CancellationToken>((session, _) =>
                sessions.Add(session))
            .ReturnsAsync((Microsoft.EntityFrameworkCore.ChangeTracking.EntityEntry<RefreshSession>)null!);

        _contextMock
            .Setup(x => x.RefreshSessions)
            .Returns(dbSetMock.Object);
    }

    private static (string hash, string salt) HashPassword(string password)
    {
        var saltBytes = RandomNumberGenerator.GetBytes(16);

        using var pbkdf2 = new Rfc2898DeriveBytes(
            password,
            saltBytes,
            10000,
            HashAlgorithmName.SHA256);

        var hashBytes = pbkdf2.GetBytes(32);

        return (
            Convert.ToBase64String(hashBytes),
            Convert.ToBase64String(saltBytes)
        );
    }

    [Fact]
    public async Task Authenticate_WhenUserNotFound_ShouldReturnFailure()
    {
        // Arrange
        var service = CreateService();

        _userQueryServiceMock
            .Setup(x => x.GetAuthUserByPhoneAsync("79990000000"))
            .ReturnsAsync(await Result<UserAuthDto>.FailureAsync("User not found"));

        // Act
        var result = await service.Authenticate(
            "79990000000",
            "password",
            "fingerprint",
            "user-agent",
            "127.0.0.1"
        );

        // Assert
        Assert.False(result.Succeeded);
        Assert.Contains("User not found", result.Errors.First());

        _contextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Never
        );
    }

    [Fact]
    public async Task Authenticate_WhenCredentialsNotFound_ShouldReturnFailure()
    {
        // Arrange
        var userId = Guid.NewGuid();

        var service = CreateService();

        _userQueryServiceMock
            .Setup(x => x.GetAuthUserByPhoneAsync("79990000000"))
            .ReturnsAsync(await Result<UserAuthDto>.SuccessAsync(new UserAuthDto
            {
                Id = userId,
                Phone = "79990000000",
                Role = Role.Student
            }));

        // Act
        var result = await service.Authenticate(
            "79990000000",
            "password",
            "fingerprint",
            "user-agent",
            "127.0.0.1"
        );

        // Assert
        Assert.False(result.Succeeded);
        Assert.Contains("Пользователь не аутентифицирован", result.Errors.First());

        _contextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Never
        );
    }

    [Fact]
    public async Task Authenticate_WhenPasswordInvalid_ShouldReturnFailure()
    {
        // Arrange
        var userId = Guid.NewGuid();

        var (hash, salt) = HashPassword("correct-password");

        _credentials.Add(new Credential
        {
            UserId = userId,
            Password = hash,
            Salt = salt
        });

        SetupCredentials(_credentials);

        var service = CreateService();

        _userQueryServiceMock
            .Setup(x => x.GetAuthUserByPhoneAsync("79990000000"))
            .ReturnsAsync(await Result<UserAuthDto>.SuccessAsync(new UserAuthDto
            {
                Id = userId,
                Phone = "79990000000",
                Role = Role.Student
            }));

        // Act
        var result = await service.Authenticate(
            "79990000000",
            "wrong-password",
            "fingerprint",
            "user-agent",
            "127.0.0.1"
        );

        // Assert
        Assert.False(result.Succeeded);
        Assert.Contains("Неверный пароль", result.Errors.First());

        _contextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Never
        );
    }

    [Fact]
    public async Task Refresh_WhenRefreshTokenNotFound_ShouldReturnFailure()
    {
        // Arrange
        var refreshToken = "refresh-token";
        var refreshTokenHash = "refresh-token-hash";

        _hashingServiceMock
            .Setup(x => x.Hash(refreshToken))
            .Returns(refreshTokenHash);

        var service = CreateService();

        // Act
        var result = await service.Refresh(refreshToken);

        // Assert
        Assert.False(result.Succeeded);
        Assert.Contains("Токен невалиден или истёк", result.Errors.First());

        _contextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Never
        );
    }

    [Fact]
    public async Task Refresh_WhenRefreshTokenExpired_ShouldReturnFailure()
    {
        // Arrange
        var userId = Guid.NewGuid();

        var refreshToken = "refresh-token";
        var refreshTokenHash = "refresh-token-hash";

        _hashingServiceMock
            .Setup(x => x.Hash(refreshToken))
            .Returns(refreshTokenHash);

        _refreshSessions.Add(new RefreshSession(
            userId,
            refreshTokenHash,
            "fingerprint",
            "user-agent",
            "127.0.0.1",
            DateTimeOffset.UtcNow.AddDays(-1)
        ));

        SetupRefreshSessions(_refreshSessions);

        var service = CreateService();

        // Act
        var result = await service.Refresh(refreshToken);

        // Assert
        Assert.False(result.Succeeded);
        Assert.Contains("Токен невалиден или истёк", result.Errors.First());

        _contextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Never
        );
    }

    [Fact]
    public async Task Refresh_WhenRefreshTokenRevoked_ShouldReturnFailure()
    {
        // Arrange
        var userId = Guid.NewGuid();

        var refreshToken = "refresh-token";
        var refreshTokenHash = "refresh-token-hash";

        _hashingServiceMock
            .Setup(x => x.Hash(refreshToken))
            .Returns(refreshTokenHash);

        var session = new RefreshSession(
            userId,
            refreshTokenHash,
            "fingerprint",
            "user-agent",
            "127.0.0.1",
            DateTimeOffset.UtcNow.AddDays(7)
        );

        session.RevokedAt = DateTimeOffset.UtcNow;

        _refreshSessions.Add(session);

        SetupRefreshSessions(_refreshSessions);

        var service = CreateService();

        // Act
        var result = await service.Refresh(refreshToken);

        // Assert
        Assert.False(result.Succeeded);
        Assert.Contains("Токен невалиден или истёк", result.Errors.First());

        _contextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Never
        );
    }

    [Fact]
    public async Task LogoutAsync_WhenRefreshTokenNotFound_ShouldReturnFailure()
    {
        // Arrange
        var refreshToken = "refresh-token";
        var refreshTokenHash = "refresh-token-hash";

        _hashingServiceMock
            .Setup(x => x.Hash(refreshToken))
            .Returns(refreshTokenHash);

        var service = CreateService();

        // Act
        var result = await service.LogoutAsync(refreshToken);

        // Assert
        Assert.False(result.Succeeded);
        Assert.Contains("Токен невалиден или истёк", result.Errors.First());

        _contextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Never
        );
    }

    [Fact]
    public async Task LogoutAsync_WhenRefreshTokenExpired_ShouldReturnFailure()
    {
        // Arrange
        var userId = Guid.NewGuid();

        var refreshToken = "refresh-token";
        var refreshTokenHash = "refresh-token-hash";

        _hashingServiceMock
            .Setup(x => x.Hash(refreshToken))
            .Returns(refreshTokenHash);

        _refreshSessions.Add(new RefreshSession(
            userId,
            refreshTokenHash,
            "fingerprint",
            "user-agent",
            "127.0.0.1",
            DateTimeOffset.UtcNow.AddDays(-1)
        ));

        SetupRefreshSessions(_refreshSessions);

        var service = CreateService();

        // Act
        var result = await service.LogoutAsync(refreshToken);

        // Assert
        Assert.False(result.Succeeded);
        Assert.Contains("Токен невалиден или истёк", result.Errors.First());

        _contextMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Never
        );
    }
}