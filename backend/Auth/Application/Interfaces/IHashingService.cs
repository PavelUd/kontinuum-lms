namespace Auth.Application.Interfaces;

public interface IHashingService
{
    public (string hashedPassword, string salt) HashWithSalt(string password);
    public string Hash(string password);
}