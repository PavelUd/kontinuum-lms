using Core.Entities;
using Courses.Application.Interfaces;
using Courses.Domain.Entities;
using Courses.Domain.Enums;
using Courses.DTO;
using Courses.DTO.Common;
using Courses.DTO.Courses;
using Courses.DTO.Lessons;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Tags("Курсы")]
[ApiController]
[Route("api/courses")]
public class CoursesController : Controller
{
    private readonly ICoursesService _coursesService;
    private readonly ILessonsService _lessonsService;

    public CoursesController(ICoursesService coursesService, ILessonsService lessonsService)
    {
        _coursesService = coursesService;
        _lessonsService = lessonsService;
    }

    
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var result = _coursesService.GetCourses();
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }
    
    [HttpPost]
    public async Task<IActionResult> CreateCourse(CourseCreateRequest request)
    {
        var idResult = _coursesService.CreateCourse(request);
        if (!idResult.Succeeded)
        {
            return BadRequest(idResult.Errors);
        }
        return Accepted($"/courses/{idResult.Data}", new { idResult.Data });
    }
    
    [Authorize(Roles = $"{nameof(Role.Admin)},{nameof(Role.Methodist)},admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCourse(Guid id)
    {
        var idResult = await _coursesService.DeleteCourse(id);
        if (!idResult.Succeeded)
        {
            return BadRequest(idResult.Errors);
        }
        return NoContent();
    }
    
    [Authorize(Roles = $"{nameof(Role.Admin)},{nameof(Role.Methodist)}")]
    [HttpPost("{id}/status")]
    public async Task<IActionResult> SetStatusCourse(Guid id,  SetStatusRequest request)
    {
        var idResult = await _coursesService.SetStatus(request.Status, id);
        if (!idResult.Succeeded)
        {
            return BadRequest(idResult.Errors);
        }
        return NoContent();
    }
    
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = _coursesService.GetCourse(id);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }
    
    [HttpGet("{id}/lessons")]
    public async Task<IActionResult> GetLessons(Guid id)
    {
        var result = await _lessonsService.GetLessons(id);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }
    
    
    [HttpPost("{id}/lessons")]
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