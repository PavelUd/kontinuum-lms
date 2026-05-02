using System.Text.Json.Serialization;

namespace BlockEngine.Application.Plugins.Questions;

public class QuestionPayload
{
    [JsonPropertyName("answer")]
    public string Answer { get; set; }
}