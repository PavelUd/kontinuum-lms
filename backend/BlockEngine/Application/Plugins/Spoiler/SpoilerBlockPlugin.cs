using System.Text.Json;
using BlockEngine.Application.Interfaces;
using BlockEngine.Application.Plugins.Heading;
using BlockEngine.Application.Plugins.Text;
using BlockEngine.Domain.Enum;
using Core;

namespace BlockEngine.Application.Plugins.Spoiler;

public class SpoilerBlockPlugin : IBlockPlugin
{
    public BlockType Type => BlockType.Spoiler;

    public Task<Result<None>> ValidateAsync(JsonElement content)
    {
        var model = content.Deserialize<SpoilerBlockContent>();

        if (string.IsNullOrWhiteSpace(model?.Text))
            return Task.FromResult(Result<None>.Failure("Text cannot be empty"));

        return Task.FromResult(Result<None>.Success());
    }

    public Task<object> RenderAsync(JsonElement content)
    {
        var model = content.Deserialize<SpoilerBlockContent>();
        return Task.FromResult<object>(model);
    }
}