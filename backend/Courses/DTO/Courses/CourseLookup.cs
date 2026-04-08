using AutoMapper;
using Courses.Domain.Entities;

namespace Courses.DTO.Courses;

public class CourseLookup
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    
    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Course, CourseLookup>();
        }
    }
}