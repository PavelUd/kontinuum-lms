using BlockEngine.Application.Interfaces;
using BlockEngine.Infrastructure;
using Core;
using Microsoft.EntityFrameworkCore;

namespace BlockEngine.Application.Services;

public class BlockSynchronizer : IBlockSynchronizer
{
    
    private readonly ILessonBlockDbContext _dbContext;

    public BlockSynchronizer(ILessonBlockDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<None>> PublishAsync(Guid draftLessonId, Guid activeLessonId)
    {
        var activeBlocks = _dbContext.LessonBlocks.Where(x => x.LessonId == activeLessonId);
        var draftBlocks = await _dbContext.LessonBlocks
            .Where(x => x.LessonId == draftLessonId).AsNoTracking()
            .ToDictionaryAsync(x => x.Id, x => x);

        foreach (var activeBlock in activeBlocks)
        {
            if (activeBlock.DraftLessonBlockId.HasValue && draftBlocks.TryGetValue(activeBlock.DraftLessonBlockId.Value, out var draftBlock))
            {
                activeBlock.Content = draftBlock.Content;
                activeBlock.OrderIndex = draftBlock.OrderIndex;
                draftBlocks.Remove(activeBlock.DraftLessonBlockId.Value);
            }
            else
            {
                _dbContext.LessonBlocks.Remove(activeBlock);
            }
        }

        foreach (var draftBlock in draftBlocks.Values)
        {
            var block = draftBlock.CloneTo(activeLessonId);
            block.DraftLessonBlockId = draftBlock.Id;
            _dbContext.LessonBlocks.Add(block);
        }
        
        await _dbContext.SaveChangesAsync();
        return await Result<None>.SuccessAsync();
    }

    public async Task<Result<None>> RollbackAsync(Guid activeLessonId, Guid draftLessonId)
    {
        var blocks = _dbContext.LessonBlocks.Where(x => x.LessonId == activeLessonId);
        
        await _dbContext.LessonBlocks.Where(x => x.LessonId == draftLessonId).ExecuteDeleteAsync();
        foreach (var block in blocks)
        {
            var draft = block.CloneTo(draftLessonId);
            _dbContext.LessonBlocks.Add(draft);
            block.DraftLessonBlockId = draft.Id;
        }
        
        await _dbContext.SaveChangesAsync();
        return await Result<None>.SuccessAsync();
    }
}