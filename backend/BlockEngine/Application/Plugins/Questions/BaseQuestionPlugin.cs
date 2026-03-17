using System.Text.Json;
using BlockEngine.Application.Interfaces;
using BlockEngine.Domain.Enum;
using Core;

namespace BlockEngine.Application.Plugins.Base.Questions;

public abstract class BaseQuestionPlugin<TContent> where TContent : BaseQuestionContent
{
    public abstract BlockType Type { get; }

    public Task<object> RenderAsync(JsonElement content)
    {
        var model = content.Deserialize<TContent>();
        return Task.FromResult<object>(model!);
    }
    
    public async Task<Result<None>> ValidateAsync(TContent model)
    {
        if (string.IsNullOrEmpty(model.CorrectAnswer))
        {
            return await Result<None>.FailureAsync();
        }

        if (string.IsNullOrEmpty(model.Question))
        {
            return await Result<None>.FailureAsync();
        }
        
        return await Result<None>.SuccessAsync();
    }
}