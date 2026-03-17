using System.Text.Json.Serialization;

namespace BlockEngine.Application.Plugins.Base.Questions;

public class BaseQuestionContent
{
    [JsonPropertyName("question")]
    public string Question { get; set; } = null!;
    
    [JsonPropertyName("description")]
    public string? Description { get; set; }
    
    [JsonPropertyName("correctAnswer")]
    public string CorrectAnswer { get; set; } = null!;
}