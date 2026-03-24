namespace Contracts.Contracts.Files;

public class PresignedUploadResult
{
    public string Key { get; set; } = default!;
    public string UploadUrl { get; set; } = default!;
    public string FileUrl { get; set; } = default!;
    public DateTime ExpiresAt { get; set; }
}