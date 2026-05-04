namespace Tracking.Application.Interface;

public interface IBlockEngagementProcessor
{
    public Task ProcessInternal(Guid blockId, Guid lessonId, double timeSpentSeconds);
}