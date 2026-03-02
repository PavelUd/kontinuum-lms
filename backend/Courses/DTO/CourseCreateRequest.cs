using AutoMapper;
using Courses.Domain.Entities;
using Courses.Domain.Enums;

namespace Courses.DTO;

public class CourseCreateRequest
{
    public string Name { get; set; }
    
    public string AvatarUrl { get; set; }
    
    public Status Status { get; set; }
    
    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<CourseCreateRequest, Course>();
        }
    }
}