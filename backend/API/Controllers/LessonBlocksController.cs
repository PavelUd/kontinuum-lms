using BlockEngine.Application.DTO;
using BlockEngine.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;


[Tags("Блоки Модулей")]
[ApiController]
[Route("api/blocks")]
public class LessonBlocksController : Controller
{
    
    private readonly IBlockService _blockService;

    public LessonBlocksController(IBlockService blockService)
    {
        _blockService = blockService;
    }
    
    [Authorize]
    [HttpPost("/api/lessons/{id}/blocks")]
    public async Task<IActionResult> CreateBlock(BlockCreateRequest request, Guid id)
    {
        var idResult = await _blockService.CreateLessonBlock(request, id);
        if (!idResult.Succeeded)
        {
            return BadRequest(idResult.Errors);
        }
        return Accepted($"/courses/{idResult.Data}", new { idResult.Data });
    }
    
    [Authorize]
    [HttpPatch("{id}/content")]
    public async Task<IActionResult> UpdateContent(UpdateContentRequest request, Guid id)
    {
        var idResult = await _blockService.UpdateBlockContent(request, id);
        if (!idResult.Succeeded)
        {
            return BadRequest(idResult.Errors);
        }
        return NoContent();
    }
    
    [Authorize]
    [HttpPatch("{id}/order-index")]
    public async Task<IActionResult> MoveBlock(Guid id, [FromBody] MoveBlockRequest request)
    {
        var idResult = await _blockService.MoveBlock(id,  request.AboveBlockId,request.BelowBlockId);
        if (!idResult.Succeeded)
        {
            return BadRequest(idResult.Errors);
        }
        return NoContent();
    }
    
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBlocks( Guid id)
    {
        var idResult = await _blockService.DeleteLessonBlock(id);
        if (!idResult.Succeeded)
        {
            return BadRequest(idResult.Errors);
        }
        return NoContent();
    }
}