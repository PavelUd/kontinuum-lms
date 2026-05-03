using Coordinator.Activities.Engagement;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Tags("Трекинг")]
[ApiController]
[Route("api/tracking")]
public class TrackingController  : Controller
{
    
    private readonly IMediator _mediator;

    public TrackingController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [Authorize]
    [HttpPost("engagement")]
    public async Task<IActionResult> TrackEngagement([FromBody] List<BlockEngagementRequest> requests)
    {
        var command = new BlockEngagementCommand(requests);
        var result = await _mediator.Send(command);
        return result.Succeeded ? Ok() : BadRequest(result.Errors);
    }
}