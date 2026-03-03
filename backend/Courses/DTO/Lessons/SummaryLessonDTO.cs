using AutoMapper;
using Courses.Domain.Entities;
using Courses.Domain.Enums;
using Courses.DTO.Courses;

namespace Courses.DTO.Lessons;

public class SummaryLessonDto
{
    public Guid CourseId { get; set; }
    
    public string? Title { get; set; }
    
    public LessonStatus Status { get; set; }
    
    public int OrderIndex { get; set; }
    
    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Lesson, SummaryLessonDto>();
        }
    }
}