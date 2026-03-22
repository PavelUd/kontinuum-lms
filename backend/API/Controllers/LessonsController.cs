using BlockEngine.Application.DTO;
using BlockEngine.Application.Interfaces;
using Core.Entities;
using Courses.Application.Interfaces;
using Courses.DTO.Common;
using Courses.DTO.Lessons;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;


[Tags("Модули")]
[ApiController]
[Route("api/lessons")]
public class LessonsController : Controller
{
    private readonly ILessonsService _lessonsService;

    public LessonsController(ILessonsService lessonsService)
    {
        _lessonsService = lessonsService;
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
    
    [HttpGet("/api/courses/{id}/lessons")]
    public async Task<IActionResult> GetLessons(Guid id)
    {
        var result = await _lessonsService.GetLessons(id);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }
    
    
    [HttpPost("/api/courses{id}/lessons")]
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