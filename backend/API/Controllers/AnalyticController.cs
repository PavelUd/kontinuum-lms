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
    
    [Authorize]
    [HttpGet("progress/courses/{courseId}/modules/{moduleId}")]
    public async Task<IActionResult> GetModuleAnalytic(Guid courseId, Guid moduleId)
    {
        var lessonsProgress = await _service.GetLessonAnalytics(moduleId, courseId);
        return Ok(lessonsProgress);
    }
    
    [Authorize]
    [HttpGet("progress/groups")]
    public async Task<IActionResult> GetGroupsAnalytic([FromQuery] Guid courseId,[FromQuery] Guid moduleId)
    {
        var lessonsProgress = await _service.GetGroupsAnalytics(courseId, moduleId);
        return Ok(lessonsProgress);
    }
    
    [Authorize]
    [HttpGet("progress/groups/{groupId}/members")]
    public async Task<IActionResult> GetGroupMembersAnalytic(Guid groupId, [FromQuery] Guid moduleId)
    {
        var lessonsProgress = await _service.GroupMembersProgress(groupId, moduleId);
        return Ok(lessonsProgress);
    }
}