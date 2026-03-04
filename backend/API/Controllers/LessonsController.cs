using BlockEngine.Application.DTO;
using BlockEngine.Application.Interfaces;
using Courses.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;


[Tags("Модули")]
[ApiController]
[Route("api/lessons")]
public class LessonsController : Controller
{
    private readonly ILessonsService _lessonsService;
    private readonly IBlockService _blockService;

    public LessonsController(ILessonsService lessonsService, IBlockService blockService)
    {
        _lessonsService = lessonsService;
        _blockService = blockService;
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
    
    [HttpGet("{id}/blocks")]
    public async Task<IActionResult>GetBlocksLesson(Guid id)
    {
        var result = await _blockService.GetBlockByLesson(id);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }
        return Ok(result);
    }
    
    [HttpPost("{id}/blocks")]
    public async Task<IActionResult>CreateBlock(CreateBlockRequest request, Guid id)
    {
        var idResult = await _blockService.CreateLessonBlock(request, id);
        if (!idResult.Succeeded)
        {
            return BadRequest(idResult.Errors);
        }
        return Accepted($"/courses/{idResult.Data}", new { idResult.Data });
    }
}