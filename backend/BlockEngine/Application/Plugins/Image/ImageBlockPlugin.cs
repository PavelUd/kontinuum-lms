using System.Text.Json;
using BlockEngine.Application.Interfaces;
using BlockEngine.Application.Plugins.Base;
using BlockEngine.Domain.Enum;
using Contracts.Services;
using Core;

namespace BlockEngine.Application.Plugins.Image;

public class ImageBlockPlugin : BaseFileBlockPlugin<BaseFileBlockContent>
{
    public ImageBlockPlugin(IStorageService fileService) 
        : base(fileService)
    {
    }

    public override BlockType Type => BlockType.Image;
}