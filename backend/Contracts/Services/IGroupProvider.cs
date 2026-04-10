using Contracts.Contracts.Groups;

namespace Contracts.Services;

public interface IGroupProvider
{
    public Dictionary<Guid, List<GroupPreview>> GetMembersGroups(List<Guid> idMembers);
}