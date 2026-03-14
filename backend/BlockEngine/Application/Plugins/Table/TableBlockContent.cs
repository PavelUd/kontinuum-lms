using System.Text.Json.Serialization;

namespace BlockEngine.Application.Plugins.Table;

public class TableBlockContent
{
    [JsonPropertyName("columns")]
    public List<TableColumn> Columns { get; set; } = [];
    
    [JsonPropertyName("rows")]
    public List<TableRow> Rows { get; set; } = [];
}

public class TableColumn
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = "";
    [JsonPropertyName("title")]
    public string Title { get; set; } = "";
}

public class TableRow
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = "";
    [JsonPropertyName("cells")]
    public List<string> Cells { get; set; } = [];
}