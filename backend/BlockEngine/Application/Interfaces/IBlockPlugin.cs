using System.Text.Json;
using BlockEngine.Domain.Enum;
using Core;

namespace BlockEngine.Application.Interfaces;

public interface IBlockPlugin
{
    BlockType Type { get; }

    Task<Result<None>> ValidateAsync(JsonElement content);

    Task<object> RenderAsync(JsonElement content);
    
    Task<Result<None>> OnRemoveAsync(Guid id, Guid idLesson)
    {
        return Result<None>.SuccessAsync();
    }
}