using BlockEngine.Application.Interfaces;
using BlockEngine.Domain.Enum;
using Contracts.Services;

namespace BlockEngine.Application.Plugins.File.Image;

public class ImageBlockPlugin : BaseFileBlockPlugin<BaseFileBlockContent>
{
    public ImageBlockPlugin(IStorageService fileService, IContentSanitizer sanitizer) 
        : base(fileService, sanitizer)
    {
    }

    public override BlockType Type => BlockType.Image;
}