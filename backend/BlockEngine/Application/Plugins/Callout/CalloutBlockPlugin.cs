using System.Text.Json;
using BlockEngine.Application.Interfaces;
using BlockEngine.Domain.Enum;
using Core;

namespace BlockEngine.Application.Plugins.Callout;

public class CalloutBlockPlugin : IBlockPlugin
{
    public BlockType Type => BlockType.Callout;
    public Task<Result<None>> ValidateAsync(JsonElement content)
    {
        var model = content.Deserialize<CalloutBlockContent>();

        if (model == null)
            return Task.FromResult(Result<None>.Failure("Invalid content"));

        if (!Enum.IsDefined(typeof(CalloutVariant), model.Variant))
            return Task.FromResult(Result<None>.Failure("Invalid callout variant"));

        return Task.FromResult(Result<None>.Success());
    }

    public Task<object> RenderAsync(JsonElement content)
    {
        var model = content.Deserialize<CalloutBlockContent>();
        return Task.FromResult<object>(model);
    }
}