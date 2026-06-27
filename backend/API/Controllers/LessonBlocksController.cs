using BlockEngine.Application.DTO;
using BlockEngine.Application.Interfaces;
using Contracts.Contracts.Files;
using Coordinator.Activities.AnswerQuestion;
using MediatR;
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
    private readonly IMediator _mediator;

    public LessonBlocksController(IBlockService blockService, IBlockFileService blockFileService, IMediator mediator)
    {
        _blockService = blockService;
        _blockFileService = blockFileService;
        _mediator = mediator;
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
    [HttpPost("/api/lessons/{id}/blocks/import")]
    public async Task<IActionResult> ImportBlocks([FromBody] List<BlockCreateRequest> request, Guid id)
    {
        var idResult = await _blockService.ImportLessonBlocks(request, id);
        if (!idResult.Succeeded)
        {
            return BadRequest(idResult.Errors);
        }
        return Accepted($"/courses/{idResult.Data}", new { idResult.Data });
    }
    
    [Authorize]
    [HttpGet("/api/lessons/{id}/blocks")]
    public async Task<IActionResult> GetBlocks(Guid id)
    {
        var result = await _blockService.GetBlockByLesson(id);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }
        return Ok(result);
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
    
    [Authorize]
    [HttpPost("{id}/submit-answer")]
    public async Task<IActionResult> SubmitAnswer(Guid id, [FromBody] AnswerQuestionRequest request)
    {

        var command = new AnswerQuestionCommand(id,request.Payload);
        var result = await _mediator.Send(command);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok(result.Data);
    }
}