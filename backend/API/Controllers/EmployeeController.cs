using Core.Common.Pagination;
using Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Users.Application.DTO;
using Users.Application.Interfaces;

namespace API.Controllers;

[Tags("Сотрудники")]
[ApiController]
[Route("api/employees")]

public class EmployeeController : ControllerBase
{
    private readonly IEmployeeService _employeeService;
    private readonly IUsersService _usersService;

    public EmployeeController(IUsersService usersService, IEmployeeService employeeService)
    {
        _usersService = usersService;
        _employeeService = employeeService;
    }

    [Authorize(Roles = $"{nameof(Role.Admin)}")]
    [HttpGet]
    public async Task<IActionResult>  GetEmployeesPage([FromQuery] PagedQuery query)
    {
        var employees = await _employeeService.GetEmployees(query);
        return Ok(employees);
    }
    
    [Authorize(Roles = $"{nameof(Role.Admin)}")]
    [HttpGet("lookup")]
    public async Task<IActionResult> GetEmployeesLookup()
    {
        var employees = await _employeeService.GetEmployeesLookup();
        return Ok(employees);
    }
    
    [Authorize(Roles = $"{nameof(Role.Admin)}")]
    [HttpPost]
    public async Task<IActionResult>  CreateEmployee([FromBody] CreateEmployeeDto request)
    {
        var result = await _usersService.CreateUser(request);
        return result.Succeeded ? Accepted(result) : BadRequest(result);
    }
    
    [Authorize(Roles = $"{nameof(Role.Admin)}")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEmployee(Guid id)
    {
        var result = await _usersService.RemoveUser(id);
        return result.Succeeded ? Accepted(result) : BadRequest(result);
    }
}