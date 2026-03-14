namespace BlockEngine.Application.Interfaces;

public interface IContentSanitizer
{
    public string Sanitize(string content);
}