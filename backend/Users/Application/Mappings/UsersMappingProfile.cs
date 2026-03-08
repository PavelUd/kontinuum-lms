using AutoMapper;
using Contracts.Contracts;
using Users.Domain;

namespace Users.Application.Mappings;

public class UsersMappingProfile : Profile
{
        public UsersMappingProfile()
        {
            CreateMap<User, UserAuthDto>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString().ToLowerInvariant()));
        }
}