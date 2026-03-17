using System.Text.Json;
using BlockEngine.Application.Interfaces;
using BlockEngine.Application.Plugins.Base.Questions;
using BlockEngine.Domain.Enum;
using Core;

namespace BlockEngine.Application.Plugins.Questions.OpenQuestion;

public class OpenQuestionPlugin : BaseQuestionPlugin<OpenQuestionContent>, IBlockPlugin
{
    public override BlockType Type => BlockType.OpenQuestion;
    public async Task<Result<None>> ValidateAsync(JsonElement content)
    {
        var model = content.Deserialize<OpenQuestionContent>();

        if (model == null)
            return await Result<None>.FailureAsync();
        
        var baseResult = await base.ValidateAsync(model);
        return baseResult;
    }
}