using Courses.Application.Interfaces;
using Courses.Domain.Entities;
using Courses.DTO;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Tags("Курсы")]
[ApiController]
[Route("api/courses")]
public class CoursesController : Controller
{
    private readonly ICoursesService _coursesService;

    public CoursesController(ICoursesService coursesService)
    {
        _coursesService = coursesService;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var result = _coursesService.GetCourses();
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = _coursesService.GetCourse(id);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }
    
    [HttpPost()]
    public async Task<IActionResult> CreateCourse(CourseCreateRequest request)
    {
        var idResult = _coursesService.CreateCourse(request);
        if (!idResult.Succeeded)
        {
            return BadRequest(idResult.Errors);
        }
        return Accepted($"/courses/{idResult.Data}", new { idResult.Data });
    }
}