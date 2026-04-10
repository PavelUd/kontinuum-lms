using AutoMapper;
using Contracts.Contracts.Groups;
using Groups.Application.DTO;
using Groups.Domain;

namespace Groups.Application.Mappings;

public class GroupsMappingProfile : Profile
{
    public GroupsMappingProfile()
    {
        CreateMap<GroupCreateRequest, Group>();
        CreateMap<CreateGroupMemberRequest, GroupMember>();
        CreateMap<GroupPreview, Group>();
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