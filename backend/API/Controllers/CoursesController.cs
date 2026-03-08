using Courses.Application.Interfaces;
using Courses.Domain.Entities;
using Courses.DTO;
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
        var idResult = _lessonsService.CreateLesson(request, id);
        if (!idResult.Succeeded)
        {
            return BadRequest(idResult.Errors);
        }
        return Accepted($"/courses/{idResult.Data}", new { idResult.Data });
    }
    
    
}