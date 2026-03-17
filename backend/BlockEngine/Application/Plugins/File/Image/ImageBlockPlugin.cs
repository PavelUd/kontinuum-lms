using BlockEngine.Domain.Enum;
using Contracts.Services;

namespace BlockEngine.Application.Plugins.File.Image;

public class ImageBlockPlugin : BaseFileBlockPlugin<BaseFileBlockContent>
{
    public ImageBlockPlugin(IStorageService fileService) 
        : base(fileService)
    {
    }

    public override BlockType Type => BlockType.Image;
}