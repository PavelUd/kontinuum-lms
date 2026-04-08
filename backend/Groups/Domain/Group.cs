using System.ComponentModel.DataAnnotations.Schema;
using Core.Entities;

namespace Groups.Domain;

[Table("groups")]
public class Group : BaseAuditableEntity
{
    [Column("course_id")]
    public Guid CourseId { get; set; }
    
    [Column("title")]
    public string Title { get; set; }
    
    public ICollection<GroupMember> Members { get; set; } = new List<GroupMember>();
}