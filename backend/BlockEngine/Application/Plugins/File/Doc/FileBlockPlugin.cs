using BlockEngine.Domain.Enum;
using Contracts.Services;

namespace BlockEngine.Application.Plugins.File.Doc;

public class  FileBlockPlugin : BaseFileBlockPlugin<BaseFileBlockContent>
{
    public FileBlockPlugin(IStorageService fileService) 
        : base(fileService)
    {
    }

    public override BlockType Type => BlockType.File;
}
