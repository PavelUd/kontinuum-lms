using System.Text.Json;
using BlockEngine.Application.Interfaces;
using BlockEngine.Application.Plugins.Spoiler;
using BlockEngine.Domain.Enum;
using Core;

namespace BlockEngine.Application.Plugins.PageBreak;

public class PageBreakBlockPlugin :  IBlockPlugin, ISafeHtmlPlugin
{
    private IContentSanitizer _sanitizer;
    
    public PageBreakBlockPlugin(IContentSanitizer sanitizer)
    {
        _sanitizer = sanitizer;
    }

    public BlockType Type => BlockType.PageBreak;
    
    public Task<Result<None>> ValidateAsync(JsonElement content)
    {
        var model = content.Deserialize<PageBreakBlockContent>();

        if (string.IsNullOrWhiteSpace(model?.Label))
            return Task.FromResult(Result<None>.Failure("Label cannot be empty"));

        return Task.FromResult(Result<None>.Success());
    }

    public Task<object> RenderAsync(JsonElement content)
    {
        var model = content.Deserialize<PageBreakBlockContent>();
        return Task.FromResult<object>(model);
    }

    public JsonElement Sanitize(JsonElement content)
    {
        var model = content.Deserialize<PageBreakBlockContent>();
        model.Label = _sanitizer.Sanitize(model.Label);
        
        return JsonSerializer.SerializeToElement(model);
    }
}