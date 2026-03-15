using System.Text.Json;
using BlockEngine.Application.Interfaces;
using BlockEngine.Application.Plugins.Image;
using BlockEngine.Domain.Enum;
using Contracts.Services;
using Core;

namespace BlockEngine.Application.Plugins.Video;

public class VideoBlockPlugin : IBlockPlugin
{
    private readonly IStorageService _fileService;

    public VideoBlockPlugin(IStorageService fileService)
    {
        _fileService = fileService;
    }

    public BlockType Type => BlockType.Video;

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
    
    public async Task<Result<None>> OnRemoveAsync(Guid id, Guid idLesson)
    {
        var prefix = $"blocks/{idLesson}/{id}/";
        return await _fileService.DeleteByPrefixAsync(prefix);
    }
}