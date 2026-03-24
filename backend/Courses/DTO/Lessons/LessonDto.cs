using AutoMapper;
using Contracts.Contracts;
using Contracts.Contracts.Blocks;
using Courses.Domain.Entities;
using Courses.Domain.Enums;

namespace Courses.DTO.Lessons;

public class LessonDto
{
    public Guid Id { get; set; }
    
    public Guid CourseId { get; set; }
    
    public string? Title { get; set; }
    
    public Status Status { get; set; }
    
    public int OrderIndex { get; set; }

    public List<LessonBlockDto> Blocks { get; set; } = new List<LessonBlockDto>();
    
    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Lesson, LessonDto>();
        }
    }
}