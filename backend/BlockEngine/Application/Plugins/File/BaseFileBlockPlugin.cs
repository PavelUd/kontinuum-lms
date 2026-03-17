using System.Text.Json;
using BlockEngine.Application.Interfaces;
using BlockEngine.Domain.Enum;
using Contracts.Services;
using Core;

namespace BlockEngine.Application.Plugins.File;

public abstract class BaseFileBlockPlugin<TContent> : IBlockPlugin, ISafeHtmlPlugin where TContent : BaseFileBlockContent
{
    private readonly IStorageService _fileService;
    private IContentSanitizer _sanitizer;

    protected BaseFileBlockPlugin(IStorageService fileService, IContentSanitizer sanitizer)
    {
        _fileService = fileService;
        _sanitizer = sanitizer;
    }

    public abstract BlockType Type { get; }

    public async Task<Result<None>> ValidateAsync(JsonElement content)
    {
        var model = content.Deserialize<TContent>();

        if (model == null)
            return await Result<None>.FailureAsync();

        return await Result<None>.SuccessAsync();
    }

    public Task<object> RenderAsync(JsonElement content)
    {
        var model = content.Deserialize<TContent>();
        return Task.FromResult<object>(model!);
    }

    public async Task<Result<None>> OnRemoveAsync(Guid blockId, Guid lessonId)
    {
        var prefix = $"lessons/{lessonId}/blocks/{blockId}/";
        return await _fileService.DeleteByPrefixAsync(prefix);
    }

    public JsonElement Sanitize(JsonElement content)
    {
        var model = content.Deserialize<TContent>();
        model.Caption = _sanitizer.Sanitize(model.Caption);
        
        return JsonSerializer.SerializeToElement(model);
    }
}