using Core.Common.Pagination;
using Core.Entities;
using Groups.Application.Interfaces;
using Groups.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Users.Application.DTO;

namespace API.Controllers;


[Tags("Группы")]
[ApiController]
[Route("api/groups")]

public class GroupsController : ControllerBase
{
    private readonly IGroupsService _service;

    public GroupsController(IGroupsService service)
    {
        _service = service;
    }
    
    [Authorize(Roles = $"{nameof(Role.Admin)}")]
    [HttpGet]
    public async Task<IActionResult>  GetGroupsPage([FromQuery] GetGroupsQuery query)
    {
        var groups = await _service.GetGroups(query, CancellationToken.None);
        return Ok(groups);
    }
    
    [Authorize(Roles = $"{nameof(Role.Admin)}")]
    [HttpPost]
    public async Task<IActionResult>  CreateGroup([FromBody] GroupCreateRequest request)
    {
        var result = await _service.CreateGroup(request);
        return result.Succeeded ? Accepted(result) : BadRequest(result);
    }
    
    [Authorize(Roles = $"{nameof(Role.Admin)}")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteGroup(Guid id)
    {
        var result = await _service.DeleteGroup(id, CancellationToken.None);
        return result.Succeeded ? Accepted(result) : BadRequest(result);
    }
}