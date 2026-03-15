namespace BlockEngine.Application.DTO;

public class GetUploadUrlRequest
{
    public string FileName { get; set; } = default!;
    public string ContentType { get; set; } = default!;
}