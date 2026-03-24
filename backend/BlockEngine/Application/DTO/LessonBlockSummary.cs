using System.Text.Json;
using BlockEngine.Domain.Enum;

namespace BlockEngine.Application.DTO;

public class LessonBlockSummary
{
    public Guid Id { get; set; }
    
    public Guid LessonId { get; set; }
    
    public BlockType  Type { get; set; }
    
    public JsonElement Content { get; set; }
}