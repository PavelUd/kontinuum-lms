using System.ComponentModel.DataAnnotations.Schema;
using Core.Entities;

namespace Auth.Domain;

[Table("invite_links")]
public class InviteLink : BaseAuditableEntity
{
    [Column("user_id")]
    public Guid UserId { get; set; }
    
    [Column("token")]
    public Guid Token { get; set; }
    
}