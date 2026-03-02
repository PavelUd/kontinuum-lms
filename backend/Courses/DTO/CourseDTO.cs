using AutoMapper;
using Courses.Domain.Entities;
using Courses.Domain.Enums;

namespace Courses.DTO;

public class CourseDTO
{
    public Guid Id { get; set; }
    
    public string Name { get; set; }
    
    public string AvatarUrl { get; set; }
    
    public Status Status { get; set; }
    
    public int LessonsCount { get; set; }
    
    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Course, CourseDTO>()
                .ForMember(
                    dest => dest.LessonsCount,
                    opt => opt.MapFrom(src => src.Lessons.Count)
                );
        }
    }
}