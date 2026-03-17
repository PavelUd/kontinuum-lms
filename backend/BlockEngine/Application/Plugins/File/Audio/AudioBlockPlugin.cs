using BlockEngine.Domain.Enum;
using Contracts.Services;

namespace BlockEngine.Application.Plugins.File.Audio;


public class AudioBlockPlugin : BaseFileBlockPlugin<BaseFileBlockContent>
{
    public  AudioBlockPlugin(IStorageService fileService) 
        : base(fileService)
    {
    }

    public override BlockType Type => BlockType.Audio;
}
