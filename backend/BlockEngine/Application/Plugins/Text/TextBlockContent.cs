using System.Text.Json.Serialization;

namespace BlockEngine.Application.Plugins.Text;

public class TextBlockContent
{
    [JsonPropertyName("title")]
    public string Title { get; set; }
    
    [JsonPropertyName("text")]
    public string Text { get; set; }
}