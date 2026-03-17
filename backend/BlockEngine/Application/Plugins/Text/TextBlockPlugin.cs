using System.Text.Json;
using BlockEngine.Application.Interfaces;
using BlockEngine.Domain.Enum;
using Core;

namespace BlockEngine.Application.Plugins.Text;

public class TextBlockPlugin : IBlockPlugin, ISafeHtmlPlugin
{
    private IContentSanitizer _sanitizer;

    public TextBlockPlugin(IContentSanitizer sanitizer)
    {
        _sanitizer = sanitizer;
    }

    public BlockType Type => BlockType.Text;

    public Task<Result<None>> ValidateAsync(JsonElement content)
    {
        var model = content.Deserialize<TextBlockContent>();

        if (string.IsNullOrWhiteSpace(model?.Text))
            return Task.FromResult(Result<None>.Failure("Text cannot be empty"));

        return Task.FromResult(Result<None>.Success());
    }

    public Task<object> RenderAsync(JsonElement content)
    {
        var model = content.Deserialize<TextBlockContent>();
        return Task.FromResult<object>(model);
    }

    public JsonElement Sanitize(JsonElement content)
    { 
        var model = content.Deserialize<TextBlockContent>();
        model.Text = _sanitizer.Sanitize(model.Text);
        
        return JsonSerializer.SerializeToElement(model);
        
    }
}