using BlockEngine.Application.Interfaces;
using BlockEngine.Domain.Enum;

namespace BlockEngine.Application.Services;

public class BlockRegistry
{
    private readonly Dictionary<BlockType, IBlockPlugin> _plugins;

    public BlockRegistry(IEnumerable<IBlockPlugin> plugins)
    {
        _plugins = plugins.ToDictionary(x => x.Type);
    }

    public IBlockPlugin Get(BlockType type)
    {
        if (!_plugins.TryGetValue(type, out var plugin))
            throw new Exception($"Unknown block type: {type}");

        return plugin;
    }
}