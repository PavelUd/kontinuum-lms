using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Auth.Domain;

[Table("credentials")]
public class Credential
{
    [Key]
    [Column("user_id")]
    public Guid UserId { get; set; }
    
    [Column("salt")]
    public string Salt { get; set; }
    
     [Column("password")]
    public string Password { get; set; }
}