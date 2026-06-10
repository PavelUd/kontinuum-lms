using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Core.Entities;
using IntegrationTests.Seed;
using Microsoft.IdentityModel.Tokens;

namespace IntegrationTests.Fixtures;

public static class TestJwtTokenProvider
{
    public static string GenerateAdminToken()
    {
        return GenerateToken(TestDataSeeder.AdminId, Role.Admin);
    }
    
    public static string GenerateStudentToken()
    {
        return GenerateToken(TestDataSeeder.StudentId, Role.Student);
    }

    public static string GenerateToken(Guid userId, Role role)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId.ToString()),
            new(ClaimTypes.Role, role.ToString()),
            new("id", userId.ToString())
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(IntegrationTestFactory.TokenSecret));

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}