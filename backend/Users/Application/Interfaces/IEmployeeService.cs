using Core.Common.Pagination;
using Users.Application.DTO;

namespace Users.Application.Interfaces;

public interface IEmployeeService
{
    public Task<PagedResult<UserDto>> GetEmployees(PagedQuery query);

    public Task<List<UserLookup>> GetEmployeesLookup();
}