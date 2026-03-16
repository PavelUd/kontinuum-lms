using BlockEngine.Application.Plugins.Base;
using BlockEngine.Domain.Enum;
using Contracts.Services;

namespace BlockEngine.Application.Plugins.Audio;


public class AudioBlockPlugin : BaseFileBlockPlugin<BaseFileBlockContent>
{
    public  AudioBlockPlugin(IStorageService fileService) 
        : base(fileService)
    {
    }

    public override BlockType Type => BlockType.Audio;
}
