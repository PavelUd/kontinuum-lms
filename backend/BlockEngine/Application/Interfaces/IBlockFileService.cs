using BlockEngine.Application.DTO;
using Contracts.Contracts.Files;
using Core;

namespace BlockEngine.Application.Interfaces;

public interface IBlockFileService
{
    public Task<Result<PresignedUploadResult>> GetUploadUrlAsync(Guid blockId, string fileName,
        string contentType);

    public Task<Result<None>> DeleteBlockFile(Guid blockId);
}