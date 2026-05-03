using Core;
using Microsoft.EntityFrameworkCore;
using Tracking.Application.Interface;
using Tracking.Domain;
using Tracking.Infrastructure;

namespace Tracking.Application;

public class BlockEngagementProcessor : IBlockEngagementProcessor
{
    private readonly ITrackingDbContext _context;

    public BlockEngagementProcessor(ITrackingDbContext context)
    {
        _context = context;
    }

    public async Task ProcessInternal(Guid blockId, Guid lessonId, double timeSpentSeconds)
    {
        var stats = await _context.BlockEngagements.FirstOrDefaultAsync(x => x.BlockId == blockId);

        if (stats is null)
        {
            _context.BlockEngagements.Add(new BlockEngagement
            {
                BlockId = blockId,
                LessonId = lessonId,
                ViewsCount = 1,
                AvgTimeSpent = timeSpentSeconds
            });

            await _context.SaveChangesAsync();
            return;
        }

        var newViewsCount = stats.ViewsCount + 1;

        stats.AvgTimeSpent =
            (stats.AvgTimeSpent * stats.ViewsCount + timeSpentSeconds)
            / newViewsCount;

        stats.ViewsCount = newViewsCount;

        await _context.SaveChangesAsync();
    }
}