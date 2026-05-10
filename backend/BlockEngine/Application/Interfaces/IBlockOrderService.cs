using BlockEngine.Domain.Entities;
using Core;

namespace BlockEngine.Application.Interfaces;

public interface IBlockOrderService
{
     public Task MoveBlock(LessonBlock block, Guid? aboveId, Guid? belowId);
}