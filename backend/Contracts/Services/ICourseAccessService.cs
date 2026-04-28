namespace Contracts.Services;

public interface ICourseAccessService
{
    Task<IReadOnlyList<Guid>> GetAccessibleCourseIds(Guid userId);
}