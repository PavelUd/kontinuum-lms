using System.Text.Json;
using BlockEngine.Application.Interfaces;
using BlockEngine.Domain.Enum;
using Core;

namespace BlockEngine.Application.Plugins.Formula;

public class FormulaBlockPlugin : IBlockPlugin
{
    public BlockType Type => BlockType.Formula;
    public Task<Result<None>> ValidateAsync(JsonElement content)
    {
        var model = content.Deserialize<FormulaBlockContent>();

        if (model == null)
            return Task.FromResult(Result<None>.Failure("Invalid content"));
        
        return Task.FromResult(Result<None>.Success());
    }

    public Task<object> RenderAsync(JsonElement content)
    {
        var model = content.Deserialize<FormulaBlockContent>();
        return Task.FromResult<object>(model);
    }
}