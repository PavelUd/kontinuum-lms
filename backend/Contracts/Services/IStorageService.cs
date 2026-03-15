using BlockEngine.Application.DTO;
using Core;

namespace Contracts.Services;

public interface IStorageService
{
    public Task<bool> CheckConnectionAsync();

    public Task<Result<PresignedUploadResult>> GetLessonUploadUrlAsync(string fileName, string contentType, string keyPrefix);

    public Task<Result<None>> DeleteByPrefixAsync(string prefix);
}