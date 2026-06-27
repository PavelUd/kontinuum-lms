using System.Text.Json.Serialization;

namespace BlockEngine.Application.Plugins.PageBreak;

public class PageBreakBlockContent
{
    [JsonPropertyName("label")]
    public string Label { get; set; }
}