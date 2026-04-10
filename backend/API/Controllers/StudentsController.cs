using Core.Common.Pagination;
using Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Users.Application.DTO;
using Users.Application.Interfaces;

namespace API.Controllers;

[Tags("Студенты")]
[ApiController]
[Route("api/students")]
public class StudentsController : ControllerBase
{
    private readonly IUsersService _usersService;
    private readonly IStudentService _studentService;

    public StudentsController(IUsersService usersService, IStudentService studentService)
    {
        _usersService = usersService;
        _studentService = studentService;
    }
    
        [Authorize(Roles = $"{nameof(Role.Admin)}")]
        [HttpGet]
        public async Task<IActionResult>  GetStudentsPage([FromQuery] GetStudentsQuery query)
        {
            var employees = await _studentService.GetStudents(query);
            return Ok(employees);
        }
        
        
        [Authorize(Roles = $"{nameof(Role.Admin)}")]
        [HttpPost]
        public async Task<IActionResult>  CreateEmployee([FromBody] CreateStudentRequest request)
        {
            var result = await _usersService.CreateUser(request);
            return result.Succeeded ? Accepted(result) : BadRequest(result);
        }
        
        [Authorize(Roles = $"{nameof(Role.Admin)}")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(Guid id)
        {
            var result = await _usersService.RemoveUser(id);
            return result.Succeeded ? Accepted(result) : BadRequest(result);
        }
        
        [Authorize(Roles = $"{nameof(Role.Admin)}")]
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> SetStatus(Guid id, [FromBody] SetUserStatusRequest request)
        {
            var result = await _usersService.SetStatus(id, request.Status);
            return result.Succeeded ? Accepted(result) : BadRequest(result);
        }
}