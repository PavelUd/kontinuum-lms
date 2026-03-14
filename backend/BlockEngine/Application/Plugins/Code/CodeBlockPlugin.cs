using System.Text.Json;
using BlockEngine.Application.Interfaces;
using BlockEngine.Domain.Enum;
using Core;

namespace BlockEngine.Application.Plugins.Code;

public class CodeBlockPlugin : IBlockPlugin
{
    public BlockType Type => BlockType.Code;
    public Task<Result<None>> ValidateAsync(JsonElement content)
    {
        var model = content.Deserialize<CodeBlockContent>();

        if (model == null)
            return Task.FromResult(Result<None>.Failure("Invalid content"));
        
        return Task.FromResult(Result<None>.Success());
    }

    public Task<object> RenderAsync(JsonElement content)
    {
        var model = content.Deserialize<CodeBlockContent>();
        return Task.FromResult<object>(model);
    }
}