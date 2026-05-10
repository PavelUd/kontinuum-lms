using AutoMapper;
using Courses.Application.Interfaces;
using Courses.Domain.Entities;
using Courses.Domain.Enums;

namespace Courses.DTO.Courses;

public class SummaryCourseDto
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
            CreateMap<Course, SummaryCourseDto>()
                .ForMember(
                    dest => dest.LessonsCount,
                    opt => opt.MapFrom(src => src.Lessons.Count(x => x.Status != Status.Draft))
                );
        }
    }
}