using Core;
using Core.Common.Pagination;
using Groups.DTO;

namespace Groups.Application.Interfaces;

public interface IGroupsService
{
    public Task<PagedResult<GroupDto>> GetGroups(GetGroupsQuery request, CancellationToken ct);
    public Task<Result<Guid>> CreateGroup(GroupCreateRequest request);
    public Task<Result<None>> DeleteGroup(Guid id, CancellationToken ct);
}