using Analytics.Domain;
using AutoMapper;

namespace Analytics.Application.DTO;

public class LessonProgressDto
{
    public Guid LessonId { get; set; }

    public double Progress { get; set; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<LessonProgress, LessonProgressDto>();
        }
    }
}