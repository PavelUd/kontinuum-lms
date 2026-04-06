using System.ComponentModel.DataAnnotations;
using Core.Entities;

namespace Users.Application.DTO;

public class CreateUserDto
{
    [Required]
    public string FullName {get; set; }
    
    [Phone]
    [Required]
    public string Phone {get; set;}
    
    [EmailAddress]
    public string Email {get; set;}
    
    [Required]
    public Role Role {get; set;}
}