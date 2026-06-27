using System.Text.Json;
using BlockEngine.Application.DTO;
using BlockEngine.Domain.Enum;
using Contracts.Contracts;
using Contracts.Contracts.Blocks;
using Core;

namespace BlockEngine.Application.Interfaces;

public interface IBlockService
{
    public Task<Result<List<LessonBlockDto>>> GetBlockByLesson(Guid lessonId);

    public Task<Result<Guid>> CreateLessonBlock(BlockCreateRequest request, Guid lessonId);

    public Task<Result<None>> DeleteLessonBlock(Guid idBlock);

    public Task<Result<ImportBlocksResponse>> ImportLessonBlocks(List<BlockCreateRequest> request, Guid lessonId);

    public Task<Result<None>> MoveBlock(Guid blockId, Guid? aboveId, Guid? belowId);

    public Task<Result<None>> UpdateBlockContent(UpdateContentRequest request, Guid idBlock);
}