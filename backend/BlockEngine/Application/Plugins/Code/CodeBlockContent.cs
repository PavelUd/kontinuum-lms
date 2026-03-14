using System.Text.Json.Serialization;

namespace BlockEngine.Application.Plugins.Code;

public class CodeBlockContent
{
    [JsonPropertyName("language")]
        public string Language { get; set; } = "plaintext";
    
    [JsonPropertyName("code")] 
     public string Code { get; set; } = string.Empty;
}