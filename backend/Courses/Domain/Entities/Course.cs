using System.ComponentModel.DataAnnotations.Schema;
using Core.Entities;
using Courses.Domain.Enums;

namespace Courses.Domain.Entities;

[Table("courses")]
public class Course : BaseAuditableEntity
{
    [Column("name")]
    public string Name { get; set; }
    
    [Column("avatar_url")]
    public string AvatarUrl { get; set; }
    
    [Column("status")]
    public Status Status { get; set; }
    
    public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
}