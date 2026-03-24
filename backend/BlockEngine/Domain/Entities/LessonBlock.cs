using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using AutoMapper;
using BlockEngine.Application.DTO;
using BlockEngine.Domain.Enum;
using Contracts.Contracts;
using Contracts.Contracts.Blocks;
using Core.Entities;

namespace BlockEngine.Domain.Entities;

[Table("lesson_blocks")]
public class LessonBlock : BaseAuditableEntity
{
    [Column("lesson_id")]
    public Guid LessonId { get; set; }
    
    [Column("order_index")]
    public double OrderIndex { get; set; }
    
    [Column("type")]
    public BlockType  Type { get; set; }
    
    [Column("content")]
    public JsonElement Content  { get; set; }
    
    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<LessonBlock, LessonBlockDto>()
                .ForMember(dest => dest.Content, opt => opt.Ignore())
                .ForMember(dest => dest.Type,
                opt => opt.MapFrom(src => src.Type.ToString().ToLower()));
        }
    }
    
}