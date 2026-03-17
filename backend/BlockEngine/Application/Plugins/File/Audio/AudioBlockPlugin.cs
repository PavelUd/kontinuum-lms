using BlockEngine.Application.Interfaces;
using BlockEngine.Domain.Enum;
using Contracts.Services;

namespace BlockEngine.Application.Plugins.File.Audio;


public class AudioBlockPlugin : BaseFileBlockPlugin<BaseFileBlockContent>
{
    public  AudioBlockPlugin(IStorageService fileService, IContentSanitizer sanitizer) 
        : base(fileService, sanitizer)
    {
    }

    public override BlockType Type => BlockType.Audio;
}
