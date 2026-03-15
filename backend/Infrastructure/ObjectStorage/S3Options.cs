namespace Infrastructure.ObjectStorage;

public sealed class S3Options
{
    public const string SectionName = "S3";

    public string Endpoint { get; set; } = string.Empty;
    public string AccessKey { get; set; } = string.Empty;
    public string SecretKey { get; set; } = string.Empty;
    public string BucketName { get; set; } = string.Empty;
    public string PublicBaseUrl { get; set; } = string.Empty;
    public bool UsePresignedUrls { get; set; } = true;
    public int PresignedUrlLifetimeMinutes { get; set; } = 10;
}