using System.Text.Json;
using BlockEngine.Application.Interfaces;
using BlockEngine.Domain.Enum;
using Core;

namespace BlockEngine.Application.Plugins.Image;

public class ImageBlockPlugin : IBlockPlugin
{
    public BlockType Type => BlockType.Image;
    public async Task<Result<None>> ValidateAsync(JsonElement content)
    {
        var model = content.Deserialize<ImageBlockContent>();

        if (model == null)
        {
            return await Result<None>.FailureAsync();
        }

        return await Result<None>.SuccessAsync();
    }

    public Task<object> RenderAsync(JsonElement content)
    {
        var model = content.Deserialize<ImageBlockContent>();
        return Task.FromResult<object>(model);
    }
}