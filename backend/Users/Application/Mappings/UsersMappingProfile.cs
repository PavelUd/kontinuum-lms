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
            CreateMap<User, UserDto>();
        }
}