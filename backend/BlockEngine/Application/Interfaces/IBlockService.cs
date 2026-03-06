using BlockEngine.Application.DTO;
using Contracts.Contracts;
using Core;

namespace BlockEngine.Application.Interfaces;

public interface IBlockService
{
    public Task<Result<List<LessonBlockDto>>> GetBlockByLesson(Guid lessonId);

    public Task<Result<Guid>> CreateLessonBlock(BlockCreateRequest request, Guid lessonId);
}