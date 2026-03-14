using System.Text.Json.Serialization;

namespace BlockEngine.Application.Plugins.Spoiler;

public class SpoilerBlockContent
{
    [JsonPropertyName("title")]
    public string Title { get; set; }
    
    [JsonPropertyName("text")]
    public string Text { get; set; }
}