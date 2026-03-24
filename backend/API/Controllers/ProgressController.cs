using Analytics.Application.Interfaces;
using Coordinator.Activities.AnswerQuestion;
using Coordinator.Activities.CompleteBlock;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Tags("Управление прогрессом")]
[ApiController]
[Route("api/progress")]
public class ProgressController : Controller
{
    private readonly IMediator _mediator;
    private readonly IUserProgressService _progressService;

    public ProgressController(IMediator mediator, IUserProgressService progressService)
    {
        _mediator = mediator;
        _progressService = progressService;
    }

    [Authorize]
    [HttpPost("complete-blocks")]
    public async Task<IActionResult> CompleteBlocks([FromBody] List<CompleteBlockRequest> requests)
    {
        var command = new CompleteBlocksCommand(requests);
        var result = await _mediator.Send(command);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok(result.Data);
    }

    [Authorize]
    [HttpGet("/courses")]
    public async Task<IActionResult> GetProgressCourse([FromBody] List<Guid> idCourses)
    {
        var courses = _progressService.GetCoursesProgress(idCourses);
        return Ok(courses);
    }
    
    [Authorize]
    [HttpGet("courses/{courseId}/lessons")]
    public async Task<IActionResult> GetLessonsProgress(Guid courseId)
    {
        var lessonsProgress = _progressService.GetLessonsProgressByCourseId(courseId);
        return Ok(lessonsProgress);
    }

    [Authorize]
    [HttpGet("/lessons/{lessonId}/completed-blocks")]
    public async Task<IActionResult> GetCompletedBlocks(Guid lessonId)
    {
        _progressService.GetCompletedBlocksByLesson(lessonId);
        return Ok();
    }
}