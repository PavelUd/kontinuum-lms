using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using BlockEngine.Domain.Enum;
using Core.Entities;

namespace BlockEngine.Domain.Entities;

[Table("lesson_blocks")]
public class LessonBlock : BaseAuditableEntity
{
    [Column("lesson_id")]
    public Guid LessonId { get; set; }
    
    [Column("order_index")]
    public int OrderIndex { get; set; }
    
    [Column("type")]
    public BlockType  Type { get; set; }
    
    [Column("content")]
    public JsonElement Content  { get; set; }
    
}