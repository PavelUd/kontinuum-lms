using System.ComponentModel.DataAnnotations.Schema;
using Core.Entities;
using Courses.Domain.Enums;

namespace Courses.Domain.Entities;

[Table("lessons")]
public class Lesson  : BaseAuditableEntity
{
    [Column("course_id")]
    public Guid CourseId { get; set; }
    
    [Column("title")]
    public string? Title { get; set; }
    
    [Column("status")]
    public Status Status { get; set; }
    
    [Column("order_index")]
    public int OrderIndex { get; set; }
    
    [Column("draft_lesson_id")]
    public Guid? DraftLessonId { get; set; }
    
}