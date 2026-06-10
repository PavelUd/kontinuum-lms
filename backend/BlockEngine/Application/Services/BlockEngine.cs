using System.Text.Json;
using BlockEngine.Application.Interfaces;
using BlockEngine.Domain.Enum;
using Core;

namespace BlockEngine.Application.Services;

public class BlockEngine : IBlockEngine
{
    private readonly BlockRegistry _registry;

    public BlockEngine(BlockRegistry registry)
    {
        _registry = registry;
    }

    public async Task<object> RenderAsync(BlockType type, JsonElement content)
    {
        var plugin = _registry.Get(type);

        return await plugin.RenderAsync(content);
    }

    public async Task<bool> CheckAsync(BlockType type, JsonElement content, JsonElement payload)
    {
        var plugin = _registry.Get(type);
        if (plugin is IBlockEvaluator evaluator)
        {
            return await evaluator.EvaluateAsync(payload, content);
        }
        return true;
    }
    
    public async Task<Result<JsonElement>> PreProcessAsync(BlockType type, JsonElement content)
    {
        var plugin = _registry.Get(type);

        var validationResult = await plugin.ValidateAsync(content);
        if (!validationResult.Succeeded)
        {
            return await Result<JsonElement>.FailureAsync(validationResult.Errors);
        }

        var result = content;
        if (plugin is ISafeHtmlPlugin safeHtmlPlugin)
        {
            result = safeHtmlPlugin.Sanitize(content);
        }

        return await Result<JsonElement>.SuccessAsync(result);
    }
    
    public async Task OnRemovingAsync(BlockType type, Guid id, Guid idLesson)
    {
        var plugin = _registry.Get(type);
        await plugin.OnRemoveAsync(id, idLesson);
    }
}