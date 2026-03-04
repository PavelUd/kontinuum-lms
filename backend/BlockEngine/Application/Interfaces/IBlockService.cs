using BlockEngine.Application.DTO;
using Core;

namespace BlockEngine.Application.Interfaces;

public interface IBlockService
{
    public Task<Result<List<LessonBlockDTO>>> GetBlockByLesson(Guid lessonId);

    public Task<Result<Guid>> CreateLessonBlock(CreateBlockRequest request, Guid lessonId);
}