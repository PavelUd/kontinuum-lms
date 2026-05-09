using BlockEngine.Application.DTO;
using BlockEngine.Application.Interfaces;
using Coordinator.Lessons.Publish;
using Coordinator.Lessons.RollBack;
using Core.Entities;
using Courses.Application.Interfaces;
using Courses.DTO.Common;
using Courses.DTO.Lessons;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;


[Tags("Модули")]
[ApiController]
[Route("api/lessons")]
public class LessonsController : Controller
{
    private readonly ILessonsService _lessonsService;
    private readonly IMediator _mediator;

    public LessonsController(ILessonsService lessonsService, IMediator mediator)
    {
        _lessonsService = lessonsService;
        _mediator = mediator;
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLesson(Guid id)
    {
        var idResult = await _lessonsService.DeleteLesson(id);
        if (!idResult.Succeeded)
        {
            return BadRequest(idResult.Errors);
        }
        return Accepted($"/courses/{idResult.Data}", new { idResult.Data });
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetLessonById(Guid id)
    {
        var result = await _lessonsService.GetLessonById(id);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }
        return Ok(result);
    }
    
    [Authorize(Roles = $"{nameof(Role.Admin)},{nameof(Role.Methodist)}")]
    [HttpPatch("{id}")]
    public async Task<IActionResult> PatchLesson(Guid id, [FromBody] PatchLessonRequest request)
    {
        var result = await _lessonsService.PatchLesson(id, request);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }
        return NoContent();
    }
    
    [Authorize(Roles = $"{nameof(Role.Admin)},{nameof(Role.Methodist)}")]
    [HttpPost("{id}/status")]
    public async Task<IActionResult> SetStatus(Guid id,  SetStatusRequest request)
    {
        var idResult = await _lessonsService.SetLessonStatus(id, request.Status);
        if (!idResult.Succeeded)
        {
            return BadRequest(idResult.Errors);
        }
        return NoContent();
    }
    
    [Authorize(Roles = $"{nameof(Role.Admin)},{nameof(Role.Methodist)}")]
    [HttpPost("{draftId}/publish")]
    public async Task<IActionResult> PublishLesson(Guid draftId)
    {
        var idResult = await _mediator.Send(new PublishLessonCommand(draftId));
        if (!idResult.Succeeded)
        {
            return BadRequest(idResult.Errors);
        }
        return NoContent();
    }
    
    [Authorize(Roles = $"{nameof(Role.Admin)},{nameof(Role.Methodist)}")]
    [HttpPost("{id}/rollback")]
    public async Task<IActionResult> RollbackLesson(Guid id)
    {
        var idResult = await _mediator.Send(new RollbackLessonCommand(id));
        if (!idResult.Succeeded)
        {
            return BadRequest(idResult.Errors);
        }
        return NoContent();
    }
    
    [HttpGet("/api/courses/{id}/lessons")]
    public async Task<IActionResult> GetLessons(Guid id)
    {
        var result = await _lessonsService.GetLessons(id);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }
    
    
    [HttpPost("/api/courses/{id}/lessons")]
    public async Task<IActionResult> CreateLesson(Guid id, LessonCreateRequest request)
    {
        var idResult = await _lessonsService.CreateLesson(request, id);
        if (!idResult.Succeeded)
        {
            return BadRequest(idResult.Errors);
        }
        return Accepted($"/courses/{idResult.Data}", new { idResult.Data });
    }
}