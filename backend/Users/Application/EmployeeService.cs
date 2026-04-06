using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core.Common.Extensions;
using Core.Common.Pagination;
using Core.Entities;
using Users.Application.DTO;
using Users.Application.Interfaces;
using Users.Infrastructure;

namespace Users.Application;

public class EmployeeService : IEmployeeService
{
    
    private readonly IUsersDbContext _context;
    private readonly IMapper _mapper;

    public EmployeeService(IUsersDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }
    
    public async Task<PagedResult<UserDto>> GetEmployees(PagedQuery query)
    {
        var employees = _context.Users.Where(u => u.Role != Role.Student)
            .OrderBy(u => u.CreatedDate) 
            .ProjectTo<UserDto>(_mapper.ConfigurationProvider);

        return await employees.ToPagedResultAsync(query.Page, query.PageSize);
    }
    
    
}