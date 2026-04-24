using Core.Entities;
using Groups.Application.DTO;
using Groups.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;


[Tags("Участники Группы")]
[ApiController]
[Route("api/groups/{id}/members")]
public class GroupMembersController : ControllerBase
{
    private readonly IGroupMembersService _groupMembersService;

    public GroupMembersController(IGroupMembersService groupMembersService)
    {
        _groupMembersService = groupMembersService;
    }
    
    [Authorize(Roles = $"{nameof(Role.Admin)}")]
    [HttpPost("")]
    public async Task<IActionResult> AddGroupMember(Guid id, [FromBody] CreateGroupMemberRequest request)
    {
        request.GroupId = id;
        var result = await _groupMembersService.CreateGroupMember(request);
        return result.Succeeded ? Accepted(result) : BadRequest(result);
    }
    
    [Authorize(Roles = $"{nameof(Role.Admin)}")]
    [HttpGet("")]
    public async Task<IActionResult> GetGroupMember(Guid id,[FromQuery] GetGroupMembersQuery query)
    {
        var result = await _groupMembersService.GetGroupMembers(query,id, CancellationToken.None);
        return Ok(result);
    }
    
    [Authorize(Roles = $"{nameof(Role.Admin)}")]
    [HttpDelete("{memberId}")]
    public async Task<IActionResult> DeleteGroupMember(Guid memberId)
    {
        var result = await _groupMembersService.DeleteGroupMember(memberId, CancellationToken.None);
        return result.Succeeded ? Accepted(result) : BadRequest(result);
    }
}