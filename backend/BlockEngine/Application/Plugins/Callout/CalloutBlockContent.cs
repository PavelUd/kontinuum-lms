using System.Text.Json;
using System.Text.Json.Serialization;

namespace BlockEngine.Application.Plugins.Callout;

public class CalloutBlockContent
{
    [JsonPropertyName("variant")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public CalloutVariant Variant { get; set; }
    
    [JsonPropertyName("text")]
    public string Text { get; set; }
}