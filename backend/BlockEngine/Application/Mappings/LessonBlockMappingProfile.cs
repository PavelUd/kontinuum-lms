using AutoMapper;
using BlockEngine.Domain.Entities;
using Contracts.Contracts;

namespace BlockEngine.Application.Mappings;

public class LessonBlockMappingProfile : Profile
{
    public LessonBlockMappingProfile()
    {
        CreateMap<LessonBlock, LessonBlockDto>()
            .ForMember(dest => dest.Content, opt => opt.Ignore())
            .ForMember(dest => dest.Type,
                opt => opt.MapFrom(src => src.Type.ToString().ToLowerInvariant()));
    }
}