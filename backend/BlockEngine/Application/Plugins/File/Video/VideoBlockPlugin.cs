using BlockEngine.Domain.Enum;
using Contracts.Services;

namespace BlockEngine.Application.Plugins.File.Video;

public class VideoBlockPlugin : BaseFileBlockPlugin<BaseFileBlockContent>
{
    public VideoBlockPlugin(IStorageService fileService) 
        : base(fileService)
    {
    }

    public override BlockType Type => BlockType.Video;
}