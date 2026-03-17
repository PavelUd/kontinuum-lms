using BlockEngine.Application.Interfaces;
using BlockEngine.Domain.Enum;
using Contracts.Services;

namespace BlockEngine.Application.Plugins.File.Video;

public class VideoBlockPlugin : BaseFileBlockPlugin<BaseFileBlockContent>
{
    public VideoBlockPlugin(IStorageService fileService, IContentSanitizer sanitizer) 
        : base(fileService, sanitizer)
    {
    }

    public override BlockType Type => BlockType.Video;
}