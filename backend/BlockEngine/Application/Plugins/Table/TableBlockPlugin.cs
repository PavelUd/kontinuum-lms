using System.Text.Json;
using BlockEngine.Application.Interfaces;
using BlockEngine.Domain.Enum;
using Core;

namespace BlockEngine.Application.Plugins.Table;

public class TableBlockPlugin :  IBlockPlugin
{
    public BlockType Type => BlockType.Table;
    public Task<Result<None>> ValidateAsync(JsonElement content)
    {
        var table = content.Deserialize<TableBlockContent>();
        
        if (table == null || table.Columns.Count == 0 || table.Columns.Count > 20 || table.Rows.Count > 200)
            return Result<None>.FailureAsync();

        foreach (var row in table.Rows)
        {
            if (row.Cells.Count != table.Columns.Count)
                return Result<None>.FailureAsync();

            foreach (var cell in row.Cells)
            {
                if (cell.Length > 2000)
                    return Result<None>.FailureAsync();
            }
        }

        return Result<None>.SuccessAsync();
    }

    public Task<object> RenderAsync(JsonElement content)
    {
        var model = content.Deserialize<TableBlockContent>();
        return Task.FromResult<object>(model);
    }
}