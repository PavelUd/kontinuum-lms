using System.Text.Json.Serialization;

namespace BlockEngine.Application.Plugins.Heading;

public class HeadingBlockContent
{
    [JsonPropertyName("text")]
    public string Text { get; set; }
}