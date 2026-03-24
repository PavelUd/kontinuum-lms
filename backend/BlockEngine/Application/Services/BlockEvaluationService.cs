using BlockEngine.Application.DTO;
using BlockEngine.Application.Interfaces;
using BlockEngine.Domain.Enum;
using BlockEngine.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace BlockEngine.Application.Services;

public class BlockEvaluationService : IBlockEvaluationService
{

    private readonly BlockEngine _blockEngine;
    private readonly ILessonBlockDbContext _dbContext;
    
    public BlockEvaluationService(BlockEngine blockEngine, ILessonBlockDbContext dbContext)
    {
        _blockEngine = blockEngine;
        _dbContext = dbContext;
    }
    
    public async Task<List<BlockEvaluationResult>> EvaluateAsync(
        List<BlockEvaluateItem> items)
    {
        var results = new List<BlockEvaluationResult>();
        var payloadMap = items.ToDictionary(x => x.BlockId, x => x.Payload);
        var blockIds = items.Select(x => x.BlockId).ToList();

        var blocks = await _dbContext.LessonBlocks
            .Where(x => blockIds.Contains(x.Id))
            .ToListAsync();
        foreach (var block in  blocks)
        {

            var isCorrect = await _blockEngine.CheckAsync(block.Type, block.Content, payloadMap[block.Id]);

            results.Add(new BlockEvaluationResult
            {
                BlockId = block.Id,
                LessonId = block.LessonId,
                IsCorrect = isCorrect,
            });
        }

        return results;
    }
}