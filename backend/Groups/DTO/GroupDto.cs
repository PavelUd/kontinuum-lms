using AutoMapper;
using Groups.Domain;

namespace Groups.DTO;

public class GroupDto
{
    public Guid CourseId { get; set; }
    
    public string Title { get; set; }
    
    public int StudentsCount { get; set; }
    
    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Group, GroupDto>()
                .ForMember(
                    dest => dest.StudentsCount,
                    opt => opt.MapFrom(src => src.Members.Count(x => x.Role == GroupRole.Student))
                );
        }
    }
}