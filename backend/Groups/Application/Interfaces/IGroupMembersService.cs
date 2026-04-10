using Core;
using Groups.Application.DTO;

namespace Groups.Application.Interfaces;

public interface IGroupMembersService
{
    public Task<Result<Guid>> CreateGroupMember(CreateGroupMemberRequest request);
}