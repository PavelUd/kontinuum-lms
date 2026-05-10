using BlockEngine.Application.Interfaces;
using BlockEngine.Domain.Entities;
using BlockEngine.Infrastructure;
using Core;
using Microsoft.EntityFrameworkCore;

namespace BlockEngine.Application.Services;

internal class BlockOrderService : IBlockOrderService
{
    private readonly ILessonBlockDbContext _dbContext;

    public BlockOrderService(ILessonBlockDbContext dbContext)
    {
        _dbContext = dbContext;
    }


    public async Task MoveBlock(LessonBlock block, Guid? aboveId, Guid? belowId)
    {

        var above = await GetOrderIndex(aboveId);
        var below = await GetOrderIndex(belowId);

        var newIndex = CalculateOrderIndex(above, below);

        if (IsPrecisionCollision(newIndex, above, below))
        {
            await ReindexLessonBlocks(block.LessonId);

            above = await GetOrderIndex(aboveId);
            below = await GetOrderIndex(belowId);

            newIndex = CalculateOrderIndex(above, below);
        }

        block.OrderIndex = newIndex;

        await _dbContext.SaveChangesAsync();
        
    }
    
    private static bool IsPrecisionCollision(double value, double? above, double? below)
    {
        return value == above || value == below;
    }
    
    private async Task<double?> GetOrderIndex(Guid? id)
    {
        if (!id.HasValue)
            return null;

        return await _dbContext.LessonBlocks
            .Where(x => x.Id == id.Value)
            .Select(x => (double?)x.OrderIndex)
            .FirstOrDefaultAsync();
    }
    
    private async Task ReindexLessonBlocks(Guid lessonId)
    {
        var blocks = await _dbContext.LessonBlocks
            .Where(x => x.LessonId == lessonId)
            .OrderBy(x => x.OrderIndex)
            .ToListAsync();

        double index = 10000;

        foreach (var block in blocks)
        {
            block.OrderIndex = index;
            index += 10000;
        }

        await _dbContext.SaveChangesAsync();
    }
    
    private static double CalculateOrderIndex(double? above, double? below)
    {
        if (above.HasValue && below.HasValue)
            return (above.Value + below.Value) / 2;

        if (above.HasValue)
            return above.Value + 10000;

        if (below.HasValue)
            return below.Value - 10000;

        return 10000;
    }
}