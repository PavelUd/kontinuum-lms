using AutoMapper;
using Courses.Domain.Entities;
using Courses.Domain.Enums;

namespace Courses.DTO.Courses;

public class CourseCreateRequest
{
    public string Name { get; set; }
    
    public string AvatarUrl { get; set; }
    
    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<CourseCreateRequest, Course>()
                .ForMember(
                    dest => dest.Name,
                    opt => opt.MapFrom(src => src.Name!.Trim())
                );
        }
    }
}