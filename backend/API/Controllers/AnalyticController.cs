using Analytics.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Tags("Аналитика")]
[ApiController]
[Route("api/analytic")]
public class AnalyticController : Controller
{

    private readonly IAnalyticProgressService _service;

    public AnalyticController(IAnalyticProgressService service)
    {
        _service = service;
    }


    [Authorize]
    [HttpGet("progress/courses/{courseId}")]
    public async Task<IActionResult> GetCourseAnalytic(Guid courseId)
    {
        var lessonsProgress = await _service.GetCourseAnalytics(courseId);
        return Ok(lessonsProgress);
    }
}