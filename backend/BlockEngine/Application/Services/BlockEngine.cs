using System.Text.Json;
using BlockEngine.Domain.Enum;
using Core;

namespace BlockEngine.Application.Services;

public class BlockEngine
{
    private readonly BlockRegistry _registry;

    public BlockEngine(BlockRegistry registry)
    {
        _registry = registry;
    }
    public async Task<Result> ValidateAsync(BlockType type, JsonElement content)
    {
        var plugin = _registry.Get(type);

        return await plugin.ValidateAsync(content);
    }

    public async Task<object> RenderAsync(BlockType type, JsonElement content)
    {
        var plugin = _registry.Get(type);

        return await plugin.RenderAsync(content);
    }
    
    public async Task OnRemovingAsync(BlockType type, Guid id, Guid idLesson)
    {
        var plugin = _registry.Get(type);
        await plugin.OnRemoveAsync(id, idLesson);
    }
}