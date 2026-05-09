using Core;

namespace BlockEngine.Application.Interfaces;

public interface IBlockSynchronizer
{
    public Task<Result<None>> PublishAsync(Guid draftLessonId, Guid activeLessonId);
    public Task<Result<None>> RollbackAsync(Guid activeLessonId, Guid draftLessonId);

}