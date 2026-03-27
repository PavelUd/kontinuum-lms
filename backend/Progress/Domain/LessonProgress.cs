using System.ComponentModel.DataAnnotations.Schema;
using Core.Entities;

namespace Analytics.Domain;

[Table("lesson_progresses")]
public class LessonProgress : BaseAuditableEntity
{
    [Column("user_id")]
    public Guid UserId { get; set; }
    
    [Column("lesson_id")]
    public Guid LessonId { get; set; }
    
    [Column("course_id")]
    public Guid CourseId { get; set; }
    
    [Column("progress")]
    public double Progress { get; set; }
    
    [Column("score")]
    public int Score { get; set; }
}