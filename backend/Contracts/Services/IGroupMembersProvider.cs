namespace Contracts.Services;

public interface IGroupMembersProvider
{
    public Task<IReadOnlyList<Guid>> GetCourseStudentIds(Guid courseId, Guid? curatorId = null);
}