using Courses.Application.Interfaces;
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
    public async Task<IActionResult> CreateLesson(Guid id)
    {
        var idResult = _lessonsService.DeleteLesson(id);
        if (!idResult.Succeeded)
        {
            return BadRequest(idResult.Errors);
        }
        return Accepted($"/courses/{idResult.Data}", new { idResult.Data });
    }
}