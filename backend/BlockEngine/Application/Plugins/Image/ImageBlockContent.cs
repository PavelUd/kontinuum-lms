using System.Text.Json.Serialization;

namespace BlockEngine.Application.Plugins.Image;

public class ImageBlockContent
{
    [JsonPropertyName("url")]
    public string Url { get; set; }
    
    [JsonPropertyName("caption")]
    public string Caption { get; set; }
}