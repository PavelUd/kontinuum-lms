using Core;
using Core.Common.Pagination;
using Groups.Application.DTO;

namespace Groups.Application.Interfaces;

public interface IGroupMembersService
{
    public Task<PagedResult<GroupMemberDto>> GetGroupMembers(GetGroupMembersQuery request,Guid idGroup, CancellationToken ct);
    public Task<Result<None>> DeleteGroupMember(Guid id, CancellationToken ct);
    public Task<Result<Guid>> CreateGroupMember(CreateGroupMemberRequest request);
}