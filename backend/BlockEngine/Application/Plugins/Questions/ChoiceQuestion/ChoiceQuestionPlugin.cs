using System.Text.Json;
using BlockEngine.Application.Interfaces;
using BlockEngine.Application.Plugins.Base.Questions;
using BlockEngine.Domain.Enum;
using Core;

namespace BlockEngine.Application.Plugins.Questions.ChoiceQuestion;

public class ChoiceQuestionPlugin : BaseQuestionPlugin<ChoiceQuestionContent>, IBlockPlugin
{
    public override BlockType Type => BlockType.ChoiceQuestion;
    
    public async Task<Result<None>> ValidateAsync(JsonElement content)
    {
        var model = content.Deserialize<ChoiceQuestionContent>();

        if (model == null)
            return await Result<None>.FailureAsync();
        
        var baseResult = await base.ValidateAsync(model);

        if (!baseResult.Succeeded || model.Options.Length == 0)
        {
            return await Result<None>.FailureAsync();
        }

        return baseResult;
    }
}