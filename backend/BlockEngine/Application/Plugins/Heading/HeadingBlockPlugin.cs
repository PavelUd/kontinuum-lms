using System.Text.Json;
using BlockEngine.Application.Interfaces;
using BlockEngine.Application.Plugins.Text;
using BlockEngine.Domain.Enum;
using Core;

namespace BlockEngine.Application.Plugins.Heading;

public class HeadingBlockPlugin  : IBlockPlugin
{
    public BlockType Type => BlockType.Heading;

    public Task<Result<None>> ValidateAsync(JsonElement content)
    {
        var model = content.Deserialize<TextBlockContent>();

        if (string.IsNullOrWhiteSpace(model?.Text))
            return Task.FromResult(Result<None>.Failure("Text cannot be empty"));

        return Task.FromResult(Result<None>.Success());
    }

    public Task<object> RenderAsync(JsonElement content)
    {
        var model = content.Deserialize<HeadingBlockContent>();
        return Task.FromResult<object>(model);
    }
}