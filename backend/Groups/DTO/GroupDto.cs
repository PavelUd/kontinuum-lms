using AutoMapper;
using Groups.Domain;

namespace Groups.DTO;

public class GroupDto
{
    public Guid Id { get; set; }
    
    public Guid CourseId { get; set; }
    
    public string CourseName  { get; set; }
    
    public Guid? TeacherId { get; set; }
    
    public string? TeacherName  { get; set; }
    
    public string Title { get; set; }
    
    public int StudentsCount { get; set; }
    
    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Group, GroupDto>()
                .ForMember(
                    dest => dest.CourseName,
                    opt => opt.Ignore()
                )
                .ForMember(
                    dest => dest.TeacherName,
                    opt => opt.Ignore()
                )
                .ForMember(
                    dest => dest.StudentsCount,
                    opt => opt.MapFrom(src =>
                        src.Members.Count(x => x.Role == GroupRole.Student)
                    )
                )
                .ForMember(
                    dest => dest.TeacherId,
                    opt => opt.MapFrom(src =>
                        src.Members
                            .Where(x => x.Role == GroupRole.Teacher)
                            .Select(x => (Guid?)x.UserId)
                            .FirstOrDefault()
                    )
                );
        }
    }
}