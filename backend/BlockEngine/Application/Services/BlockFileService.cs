using BlockEngine.Application.DTO;
using BlockEngine.Application.Interfaces;
using BlockEngine.Infrastructure;
using Contracts.Services;
using Core;

namespace BlockEngine.Application.Services;

public class BlockFileService : IBlockFileService
{
    private  readonly IStorageService _storageService;
    private readonly ILessonBlockDbContext _dbContext;
    
    public BlockFileService(IStorageService storageService, ILessonBlockDbContext dbContext)
    {
        _storageService = storageService;
        _dbContext = dbContext;
    }

    public async Task<Result<PresignedUploadResult>> GetUploadUrlAsync(Guid blockId, string fileName, string contentType)
    {
        var block = _dbContext.LessonBlocks.FirstOrDefault(x => x.Id == blockId);
        if (block == null)
        {
            return await Result<PresignedUploadResult>.FailureAsync();
        }
        
        var prefix = $"lessons/{block.LessonId}/blocks/{blockId}";

        return await _storageService.GetLessonUploadUrlAsync(fileName, contentType, prefix);
    }
    
    public async Task<Result<None>> DeleteBlockFile(Guid blockId)
        {
            var block = _dbContext.LessonBlocks.FirstOrDefault(x => x.Id == blockId);
            if (block == null)
            {
                return await Result<None>.FailureAsync();
            }
            
            var prefix = $"lessons/{block.LessonId}/blocks/{blockId}";
    
            return await _storageService.DeleteByPrefixAsync(prefix);
        }
}