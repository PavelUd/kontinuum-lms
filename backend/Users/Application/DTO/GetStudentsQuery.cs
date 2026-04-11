using Core.Common.Pagination;
using Users.Domain;

namespace Users.Application.DTO;

public class GetStudentsQuery : PagedQuery
{
    public string? StudentName { get; set; }
    
    public int? Class { get; set; }
    
    public UserStatus? Status {get; set; }
    
}