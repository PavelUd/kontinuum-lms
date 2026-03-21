using AutoMapper;
using Courses.Domain.Entities;

namespace Courses.DTO.Lessons;

public class LessonCreateRequest
{
    public string? Title { get; set; }
    
    public int OrderIndex { get; set; }
    
    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<LessonCreateRequest, Lesson>();
        }
    }
}