using System.Text.Json;
using BlockEngine.Application.Interfaces;
using BlockEngine.Domain.Enum;
using Core;

namespace BlockEngine.Application.Plugins.Table;

public class TableBlockPlugin :  IBlockPlugin, ISafeHtmlPlugin
{
    public BlockType Type => BlockType.Table;
    private IContentSanitizer _sanitizer;

    public TableBlockPlugin(IContentSanitizer sanitizer)
    {
        _sanitizer = sanitizer;
    }

    public Task<Result<None>> ValidateAsync(JsonElement content)
    {
        var table = content.Deserialize<TableBlockContent>();
        
        if (table == null || table.Columns.Count == 0 || table.Columns.Count > 20 || table.Rows.Count > 200)
            return Result<None>.FailureAsync("Количество строк и колонок вышло за границы");

        foreach (var row in table.Rows)
        {
            if (row.Cells.Count != table.Columns.Count)
                return Result<None>.FailureAsync("Несответсвие строки и кроличества колонок");

            foreach (var cell in row.Cells)
            {
                if (cell.Length > 2000)
                    return Result<None>.FailureAsync("Слишком длинная ячейка");
            }
        }

        return Result<None>.SuccessAsync();
    }

    public Task<object> RenderAsync(JsonElement content)
    {
        var model = content.Deserialize<TableBlockContent>();
        return Task.FromResult<object>(model);
    }

    public JsonElement Sanitize(JsonElement content)
    {
        var table = content.Deserialize<TableBlockContent>();

        if (table == null)
            return content;
        
        for (var i = 0; i < table.Columns.Count; i++)
        {
            table.Columns[i].Title = _sanitizer.Sanitize(table.Columns[i].Title);
        }
        
        for (var i = 0; i < table.Rows.Count; i++)
        {
            for (var j = 0; j < table.Rows[i].Cells.Count; j++)
            {
                table.Rows[i].Cells[j] = _sanitizer.Sanitize(table.Rows[i].Cells[j]);
            }
        }
        
        return JsonSerializer.SerializeToElement(table);
    }
}