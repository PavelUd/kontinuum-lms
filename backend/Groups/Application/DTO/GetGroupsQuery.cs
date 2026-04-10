using Core.Common.Pagination;

namespace Groups.Application.DTO;

public class GetGroupsQuery : PagedQuery
{
    public Guid? CourseId { get; init; }
    public Guid? TeacherId { get; init; }
}