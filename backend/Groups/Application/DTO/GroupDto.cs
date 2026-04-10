using AutoMapper;
using Groups.Domain;

namespace Groups.Application.DTO;

public class GroupDto
{
    public Guid Id { get; set; }
    
    public Guid CourseId { get; set; }
    
    public string CourseName  { get; set; }
    
    public Guid? TeacherId { get; set; }
    
    public string? TeacherName  { get; set; }
    
    public string Title { get; set; }
    
    public int StudentsCount { get; set; }
}