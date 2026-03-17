using System.Text.Json.Serialization;
using BlockEngine.Application.Plugins.Base.Questions;

namespace BlockEngine.Application.Plugins.Questions.ChoiceQuestion;

public class ChoiceQuestionContent : BaseQuestionContent
{
    [JsonPropertyName("options")]
    public string[] Options { get; set; }
    
    [JsonPropertyName("variant")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public ChoiceQuestionVariant Variant { get; set; }
}