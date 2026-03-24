using Amazon.S3;
using Amazon.S3.Model;
using BlockEngine.Application.DTO;
using BlockEngine.Application.Interfaces;
using Contracts.Contracts.Files;
using Contracts.Services;
using Core;
using Microsoft.Extensions.Options;

namespace Infrastructure.ObjectStorage;

public class StorageService : IStorageService
{
    private readonly IAmazonS3 _s3Client;
    private readonly IOptions<S3Options> _options;

    public StorageService(IAmazonS3 s3Client, IOptions<S3Options> options)
    {
        _s3Client = s3Client;
        _options = options;
    }
    
    public async Task<Result<PresignedUploadResult>> GetLessonUploadUrlAsync(string fileName, string contentType, string keyPrefix)
    {
        var extension = Path.GetExtension(fileName);
        var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(fileName);
        var key = $"{keyPrefix}/{fileNameWithoutExtension}{extension}";
        var expires = DateTime.UtcNow.AddMinutes(10);

        var request = new GetPreSignedUrlRequest
        {
            BucketName = _options.Value.BucketName,
            Key = key,
            Verb = HttpVerb.PUT,
            Expires = expires,
            ContentType = contentType
        };

        try
        {
            var uploadUrl = await _s3Client.GetPreSignedURLAsync(request);

            return await Result<PresignedUploadResult>.SuccessAsync(new PresignedUploadResult
            {
                Key = key,
                UploadUrl = uploadUrl,
                FileUrl = $"{_options.Value.PublicBaseUrl}/{key}",
                ExpiresAt = expires
            });
        }
        catch (Exception ex)
        {
            return await Result<PresignedUploadResult>.FailureAsync(ex.Message);
        }
    }
    
    
    public async Task<Result<None>> DeleteByPrefixAsync(string prefix)
    {
        var bucket = _options.Value.BucketName;

        var request = new ListObjectsV2Request
        {
            BucketName = bucket,
            Prefix = prefix
        };

        ListObjectsV2Response response;

        try
        {
            do
            {
                response = await _s3Client.ListObjectsV2Async(request);

                if (response.S3Objects.Count > 0)
                {
                    var deleteRequest = new DeleteObjectsRequest
                    {
                        BucketName = bucket,
                        Objects = response.S3Objects
                            .Select(o => new KeyVersion { Key = o.Key })
                            .ToList()
                    };

                    await _s3Client.DeleteObjectsAsync(deleteRequest);
                }

                request.ContinuationToken = response.NextContinuationToken;

            } while (response.IsTruncated.HasValue && response.IsTruncated.Value);

            return await Result<None>.SuccessAsync();
        }

        catch (Exception ex)
        {
            return await Result<None>.FailureAsync(ex.Message);
        }
        
    }
    
    public async Task<bool> CheckConnectionAsync()
    {
        try
        {
            var response = await _s3Client.ListBucketsAsync();
            return response.HttpStatusCode == System.Net.HttpStatusCode.OK;
        }
        catch
        {
            return false;
        }
    }
}