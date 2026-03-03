using AutoMapper;
using Courses.Domain.Entities;
using Courses.Domain.Enums;
using Courses.DTO.Lessons;

namespace Courses.DTO.Courses;

public class CourseDto
{
    public Guid Id { get; set; }
    
    public string Name { get; set; }
    
    public string AvatarUrl { get; set; }
    
    public Status Status { get; set; }
    
    public int LessonsCount { get; set; }
    
    public ICollection<SummaryLessonDto> Lessons { get; set; } = new List<SummaryLessonDto>();
    
    
    
    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Course, CourseDto>()
                .ForMember(
                    dest => dest.LessonsCount,
                    opt => opt.MapFrom(src => src.Lessons.Count)
                );
        }
    }
}