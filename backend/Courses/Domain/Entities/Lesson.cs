using System.ComponentModel.DataAnnotations.Schema;
using Core.Entities;

namespace Courses.Domain.Entities;

[Table("lessons")]
public class Lesson : BaseEntity
{
    [Column("course_id")]
    public Guid CourseId { get; set; }
    
    
public Course Course { get; set; }
}