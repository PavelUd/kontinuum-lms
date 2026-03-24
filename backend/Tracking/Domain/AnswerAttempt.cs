using System.ComponentModel.DataAnnotations.Schema;
using Core.Entities;

namespace Tracking.Domain;

[Table("answer_attempts")]
public class AnswerAttempt : BaseEntity
{
    [Column("user_id")]
    public Guid UserId { get; set; }
    
    [Column("block_id")]
    public Guid BlockId { get; set; }
    
    [Column("lesson_id")]
    public Guid LessonId { get; set; }
    
    [Column("answer")]
    public string Answer { get; set; }
    
    [Column("is_correct")]
    public bool IsCorrect { get; set; }
    
    [Column("answer_timestamp")]
    public DateTime AnswerTime { get; set; } = DateTime.Now.ToUniversalTime(); 
}