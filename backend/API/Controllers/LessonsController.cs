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
        var idResult = _lessonsService.DeleteLesson(id);
        if (!idResult.Succeeded)
        {
            return BadRequest(idResult.Errors);
        }
        return Accepted($"/courses/{idResult.Data}", new { idResult.Data });
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetLessonByLesson(Guid id)
    {
        var result = await _lessonsService.GetLessonById(id);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }
        return Ok(result);
    }
    
    [HttpPatch("{id}/title")]
    public async Task<IActionResult> UpdateLessonTitle(Guid id, [FromBody] UpdateTitleRequest request)
    {
        var result = await _lessonsService.UpdateTitle(request.Title, id);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }
        return NoContent();
    }
    
    [Authorize(Roles = $"{nameof(Role.Admin)},{nameof(Role.Methodist)}")]
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> SetStatus(Guid id,  SetStatusRequest request)
    {
        var idResult = await _lessonsService.SetLessonStatus(id, request.Status);
        if (!idResult.Succeeded)
        {
            return BadRequest(idResult.Errors);
        }
        return NoContent();
    }
}