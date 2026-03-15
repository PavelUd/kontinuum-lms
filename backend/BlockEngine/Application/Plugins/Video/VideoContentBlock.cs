using System.Text.Json.Serialization;

namespace BlockEngine.Application.Plugins.Video;

public class VideoContentBlock
{
    [JsonPropertyName("url")]
    public string Url { get; set; }
    
    [JsonPropertyName("caption")]
    public string Caption { get; set; }
}