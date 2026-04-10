using System.ComponentModel.DataAnnotations.Schema;
using Core.Entities;

namespace Groups.Domain;

[Table("group_members")]
public class GroupMember : BaseEntity
{
    [Column("group_id")]
    public Guid GroupId { get; set; }
    
    [Column("user_id")]
    public Guid UserId { get; set; }
    
    [Column("role")]
    public GroupRole Role { get; set; }
    
    [Column("joined_at")]
    public DateTime? JoinedAt { get; set; } = DateTime.Now.ToUniversalTime();
    
    public Group Group { get; set; }
}