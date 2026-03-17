using BlockEngine.Application.Interfaces;
using BlockEngine.Domain.Enum;
using Contracts.Services;

namespace BlockEngine.Application.Plugins.File.Doc;

public class  FileBlockPlugin : BaseFileBlockPlugin<BaseFileBlockContent>
{
    public FileBlockPlugin(IStorageService fileService, IContentSanitizer sanitizer) 
        : base(fileService, sanitizer)
    {
    }

    public override BlockType Type => BlockType.File;
}
