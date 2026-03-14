using System.Text.Json.Serialization;

namespace BlockEngine.Application.Plugins.Formula;

public class FormulaBlockContent
{
    [JsonPropertyName("formula")]
    public string Formula { get; set; }
}