using Core;

namespace BlockEngine.Application.Interfaces;

public interface IBlockOrderService
{
     public Task<Result<None>> MoveBlock(Guid blockId, Guid? aboveId, Guid? belowId);
}