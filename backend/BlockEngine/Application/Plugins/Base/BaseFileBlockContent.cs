using System.Text.Json.Serialization;

namespace BlockEngine.Application.Plugins.Base;

public class BaseFileBlockContent
{
    [JsonPropertyName("url")]
    public string Url { get; set; }
    
    [JsonPropertyName("caption")]
    public string Caption { get; set; }
}