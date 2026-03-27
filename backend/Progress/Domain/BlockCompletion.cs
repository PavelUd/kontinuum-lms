using System.ComponentModel.DataAnnotations.Schema;
using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Analytics.Domain;
[Index(nameof(UserId), nameof(BlockId), IsUnique = true, Name = "ux_block_completion_user_block")]
[Table("block_completions")]
public class BlockCompletion : BaseAuditableEntity
{
    [Column("user_id")]
    public Guid UserId { get; set; }
    
    [Column("lesson_id")]
    public Guid LessonId { get; set; }
    
    [Column("block_id")]
    public Guid BlockId { get; set; }
    
    [Column("affect_score")]
    public bool AffectsScore{  get; set; }
}