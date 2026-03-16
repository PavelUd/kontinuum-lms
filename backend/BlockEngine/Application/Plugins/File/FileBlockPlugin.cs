using BlockEngine.Application.Plugins.Base;
using BlockEngine.Domain.Enum;
using Contracts.Services;

namespace BlockEngine.Application.Plugins.File;

public class  FileBlockPlugin : BaseFileBlockPlugin<BaseFileBlockContent>
{
    public FileBlockPlugin(IStorageService fileService) 
        : base(fileService)
    {
    }

    public override BlockType Type => BlockType.File;
}
