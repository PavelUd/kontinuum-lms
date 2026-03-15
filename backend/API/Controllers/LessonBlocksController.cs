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
    private readonly IBlockFileService _blockFileService;

    public LessonBlocksController(IBlockService blockService, IBlockFileService blockFileService)
    {
        _blockService = blockService;
        _blockFileService = blockFileService;
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
    
    [Authorize]
    [HttpPost("{blockId}/file/presigned")]
    public async Task<ActionResult<PresignedUploadResult>> GetUploadUrl(Guid blockId, [FromBody] GetUploadUrlRequest request)
    {
        var result = await _blockFileService.GetUploadUrlAsync(blockId, request.FileName, request.ContentType);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }
        return Ok(result);
    }
    
    [Authorize]
    [HttpDelete("{blockId}/file/")]
    public async Task<ActionResult<PresignedUploadResult>> DeleteFile(Guid blockId)
    {
        var result = await _blockFileService.DeleteBlockFile(blockId);
        
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }
        
        return Ok(result);
    }
}