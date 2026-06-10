using System.Text.Json;
using BlockEngine.Domain.Enum;
using Core;

namespace BlockEngine.Application.Interfaces;

public interface IBlockEngine
{
    public Task<object> RenderAsync(BlockType type, JsonElement content);

    public Task<bool> CheckAsync(BlockType type, JsonElement content, JsonElement payload);

    public  Task<Result<JsonElement>> PreProcessAsync(BlockType type, JsonElement content);
    public Task OnRemovingAsync(BlockType type, Guid id, Guid idLesson);

}