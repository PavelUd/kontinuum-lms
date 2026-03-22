using AutoMapper;
using Courses.Domain.Entities;
using Courses.Domain.Enums;

namespace Courses.DTO.Lessons;

public class PatchLessonRequest
{
    public string? Title { get; set; }
    
    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<PatchLessonRequest, Lesson>()
                .ForAllMembers(opts =>
                    opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}

