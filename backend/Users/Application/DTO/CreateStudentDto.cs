using System.ComponentModel.DataAnnotations;

namespace Users.Application.DTO;

public class CreateStudentRequest : IUserCreateRequest
{
    [Required]
    public string FullName {get; set; }
    
    [Phone]
    [Required]
    public string Phone {get; set;}
    
    [EmailAddress]
    public string Email {get; set;}
    
    [Required]
    public int Class { get; set; }
}