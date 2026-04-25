using Core.Entities;
using Groups.Application.DTO;
using Groups.Application.Interfaces;
using Groups.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;


[Tags("Группы")]
[ApiController]
[Route("api/groups")]

public class GroupsController : ControllerBase
{
    private readonly IGroupsService _service;
    private readonly IGroupMembersService _groupMembersService;

    public GroupsController(IGroupsService service, IGroupMembersService groupMembersService)
    {
        _service = service;
        _groupMembersService = groupMembersService;
    }
    
    [Authorize(Roles = $"{nameof(Role.Admin)}")]
    [HttpGet]
    public async Task<IActionResult>  GetGroupsPage([FromQuery] GetGroupsQuery query)
    {
        var groups = await _service.GetGroups(query, CancellationToken.None);
        return Ok(groups);
    }
    
    [Authorize(Roles = $"{nameof(Role.Admin)}")]
    [HttpGet("lookup/available")]
    public async Task<IActionResult>  GetAvailableLookupGroups([FromQuery] Guid courseId, [FromQuery] Guid userId)
    {
        var groups = await _service.GetAvailableGroupsAsync(courseId, userId);
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
    [HttpPatch("{id}")]
    public async Task<IActionResult> PatchGroup(Guid id, [FromBody] PatchGroupRequest request)
    {
        var result = await _service.PatchGroup(id, request);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }
    
    [Authorize(Roles = $"{nameof(Role.Admin)}")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteGroup(Guid id)
    {
        var result = await _service.DeleteGroup(id, CancellationToken.None);
        return result.Succeeded ? Accepted(result) : BadRequest(result);
    }
}