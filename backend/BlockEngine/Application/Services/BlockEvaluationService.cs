using BlockEngine.Application.DTO;
using BlockEngine.Application.Interfaces;
using BlockEngine.Domain.Enum;
using BlockEngine.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace BlockEngine.Application.Services;

public class BlockEvaluationService : IBlockEvaluationService
{

    private readonly IBlockEngine _blockEngine;
    private readonly ILessonBlockDbContext _dbContext;
    
    public BlockEvaluationService(IBlockEngine blockEngine, ILessonBlockDbContext dbContext)
    {
        _blockEngine = blockEngine;
        _dbContext = dbContext;
    }
    
    public async Task<List<BlockEvaluationResult>> EvaluateAsync(
        List<BlockEvaluateItem> items)
    {
        var results = new List<BlockEvaluationResult>();
        var payloadMap = items
            .GroupBy(x => x.BlockId)
            .ToDictionary(
                g => g.Key,
                g => g.Select(x => x.Payload).ToList()
            );
        var blockIds = items.Select(x => x.BlockId).ToList();

        var blocks = await _dbContext.LessonBlocks
            .Where(x => blockIds.Contains(x.Id))
            .ToListAsync();
        foreach (var block in  blocks)
        {
            var isCorrect = false;
            foreach (var payload in payloadMap[block.Id])
            {
                isCorrect = await _blockEngine.CheckAsync(block.Type, block.Content, payload);
                if (isCorrect)
                {
                    break;
                }
            }

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