using System.Text.Json;
using System.Text.Json.Serialization;
using AutoMapper;
using BlockEngine.Domain.Entities;
using BlockEngine.Domain.Enum;

namespace BlockEngine.Application.DTO;

public class LessonBlockDTO
{
    public Guid Id { get; set; }
    
    public Guid LessonId { get; set; }
    
    public int OrderIndex { get; set; }
    
    public BlockType  Type { get; set; }
    
    public object Content  { get; set; }
    
    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<LessonBlock, LessonBlockDTO>()
                .ForMember(dest => dest.Content, opt => opt.Ignore());;
        }
    }
}