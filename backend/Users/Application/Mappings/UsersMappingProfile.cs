using AutoMapper;
using Contracts.Contracts;
using Contracts.Contracts.Users;
using Users.Application.DTO;
using Users.Domain;

namespace Users.Application.Mappings;

public class UsersMappingProfile : Profile
{
        public UsersMappingProfile()
        {
            CreateMap<User, UserAuthDto>();
            CreateMap<CreateStudentRequest, User>()
                .ForMember(dest => dest.StudentProfile,
                    opt => opt.MapFrom(src => new StudentProfile
                    {
                        Class = Math.Clamp(src.Class, 1, 11)
                    }));
            CreateMap<User, UserDto>();
            CreateMap<User, Student>()
                .ForMember(dest => dest.Class,
                    opt => opt.MapFrom(src => src.StudentProfile != null 
                        ? src.StudentProfile.Class 
                        : 0));
            CreateMap<CreateEmployeeDto, User>();
            CreateMap<User, UserLookup>();
        }
}