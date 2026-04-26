using Contracts.Contracts.Groups;
using Core;
using Core.Common.Pagination;
using Groups.Application.DTO;

namespace Groups.Application.Interfaces;

public interface IGroupsService
{
    public Task<PagedResult<GroupDto>> GetGroups(GetGroupsQuery request, CancellationToken ct);
    public Task<Result<Guid>> CreateGroup(GroupCreateRequest request);
    public Task<Result<None>> DeleteGroup(Guid id, CancellationToken ct);
    public Task<GroupDto?> GetGroupById(Guid idGroup);
    public Task<List<GroupPreview>> GetAvailableGroupsAsync(Guid? courseId, Guid? userId);
    public Task<Result<None>> PatchGroup(Guid idGroup, PatchGroupRequest request);

}