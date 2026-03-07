using System.Security.Cryptography;
using System.Text;
using Auth.Application.Interfaces;

namespace Infrastructure.Hashing;

public class HashingService : IHashingService
{
    public  (string hashedPassword, string salt) HashWithSalt(string password)
    {
        var salt = new byte[16];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(salt);
        }
            
        using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256);
        var hash = pbkdf2.GetBytes(32);
        var hashedPassword = Convert.ToBase64String(hash);
        var saltBase64 = Convert.ToBase64String(salt);

        return (hashedPassword, saltBase64);
    }
    
    public string Hash(string password)
    {
        using var sha256 = SHA256.Create();
        var tokenBytes = Encoding.UTF8.GetBytes(password);
        var hashBytes = sha256.ComputeHash(tokenBytes);
        return Convert.ToBase64String(hashBytes);
    }
}