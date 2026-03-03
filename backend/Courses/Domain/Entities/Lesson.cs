using System.ComponentModel.DataAnnotations.Schema;
using Core.Entities;
using Courses.Domain.Enums;

namespace Courses.Domain.Entities;

[Table("lessons")]
public class Lesson : BaseEntity
{
    [Column("course_id")]
    public Guid CourseId { get; set; }
    
    [Column("title")]
    public string? Title { get; set; }
    
    [Column("status")]
    public LessonStatus Status { get; set; }
    
    [Column("order_index")]
    public int OrderIndex { get; set; }
}