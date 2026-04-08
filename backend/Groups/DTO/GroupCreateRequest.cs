using AutoMapper;
using Groups.Domain;

namespace Groups.DTO;

public class GroupCreateRequest
{
    public Guid CourseId { get; set; }
    
    public Guid TeacherId {get; set; }
    
    public string Title { get; set; }
    
    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<GroupCreateRequest, Group>();
        }
    }
}