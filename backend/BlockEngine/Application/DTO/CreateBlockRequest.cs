using System.Text.Json;
using System.Text.Json.Serialization;
using AutoMapper;
using BlockEngine.Domain.Entities;
using BlockEngine.Domain.Enum;

namespace BlockEngine.Application.DTO;

public class CreateBlockRequest
{
    [JsonIgnore]
    public Guid LessonId { get; set; }
    
    public int OrderIndex { get; set; }
    
    public JsonElement Content  { get; set; }
    
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public BlockType Type { get; set; }
    
    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<CreateBlockRequest, LessonBlock>();
        }
    }
    
    
}