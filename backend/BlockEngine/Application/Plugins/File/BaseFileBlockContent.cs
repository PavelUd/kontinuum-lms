using System.Text.Json.Serialization;

namespace BlockEngine.Application.Plugins.File;

public class BaseFileBlockContent
{
    [JsonPropertyName("url")]
    public string Url { get; set; }
    
    [JsonPropertyName("caption")]
    public string Caption { get; set; }
}