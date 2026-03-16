using System.Text.Json;
using BlockEngine.Application.Interfaces;
using BlockEngine.Application.Plugins.Base;
using BlockEngine.Application.Plugins.Image;
using BlockEngine.Domain.Enum;
using Contracts.Services;
using Core;

namespace BlockEngine.Application.Plugins.Video;

public class VideoBlockPlugin : BaseFileBlockPlugin<BaseFileBlockContent>
{
    public VideoBlockPlugin(IStorageService fileService) 
        : base(fileService)
    {
    }

    public override BlockType Type => BlockType.Video;
}