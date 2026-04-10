using System.ComponentModel.DataAnnotations.Schema;
using Core.Entities;

namespace Users.Domain;

[Table("users")]
public class User : BaseAuditableEntity
{
    [Column("full_name")]
    public string FullName {get; set; }
    
    [Column("phone")]
    public string Phone {get; set;}
    
    [Column("email")]
    public string Email {get; set;}
    
    [Column("status")]
    public UserStatus Status {get; set;}
    
    [Column("role")]
    public Role Role {get; set;}
    
    public StudentProfile? StudentProfile { get; set; }
    
}