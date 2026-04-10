using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Users.Domain;

[Table("student_profiles")]
public class StudentProfile
{
    [Key]
    public Guid UserId { get; set; }
    
    [Column("class")]
    public int Class {get; set; }
    
    public User User { get; set; }
}