using System.Text.Json;
using AutoMapper;
using BlockEngine.Application.DTO;
using BlockEngine.Application.Interfaces;
using BlockEngine.Domain.Entities;
using BlockEngine.Infrastructure;
using Contracts.Contracts;
using Core;
using Microsoft.EntityFrameworkCore;

namespace BlockEngine.Application.Services;

public class BlockService : IBlockService
{
    private readonly ILessonBlockDbContext _dbContext;
    private readonly BlockEngine _blockEngine;
    private readonly IMapper _mapper;


    public BlockService(ILessonBlockDbContext dbContext, BlockEngine blockEngine, IMapper mapper)
    {
        _dbContext = dbContext;
        _blockEngine = blockEngine;
        _mapper = mapper;
    }

    public async Task<Result<List<LessonBlockDto>>> GetBlockByLesson(Guid lessonId)
    {
        try
        {
            var blocks = await _dbContext.LessonBlocks
                .Where(x => x.LessonId == lessonId)
                .OrderBy(x => x.OrderIndex)
                .ToListAsync();

            var tasks = blocks.Select(async block =>
            {
                var dto = _mapper.Map<LessonBlockDto>(block);
                var rendered = await _blockEngine.RenderAsync(block.Type, block.Content);
                dto.Content = rendered;

                return dto;
            });

            var result = await Task.WhenAll(tasks);

            return await Result<List<LessonBlockDto>>.SuccessAsync(result.ToList());
        }
        catch (Exception ex)
        {
            return await Result<List<LessonBlockDto>>.FailureAsync(ex.Message);
        }
    }

    public async Task<Result<Guid>> CreateLessonBlock(BlockCreateRequest request, Guid lessonId)
    {
        try
        {
            
            var block = _mapper.Map<LessonBlock>(request);
            block.LessonId = lessonId;
            var validationResult = await _blockEngine.ValidateAsync(request.Type, block.Content);
            if(!validationResult.Succeeded)
            {
                return await Result<Guid>.FailureAsync(string.Join(", ", validationResult.Errors));
            }

            var maxOrderIndex = await _dbContext.LessonBlocks
                .Where(x => x.LessonId == lessonId)
                .MaxAsync(x => (int?)x.OrderIndex) ?? -1;
            
            block.OrderIndex = maxOrderIndex + 1;
            _dbContext.LessonBlocks.Add(block);
            await _dbContext.SaveChangesAsync();
            return await Result<Guid>.SuccessAsync(block.Id);

        }
        catch (Exception ex)
        {
            return await Result<Guid>.FailureAsync(ex.Message);
        }
    }
    
    public async Task<Result<None>> UpdateBlockContent(UpdateContentRequest request, Guid idBlock)
    {
        try
        {
            var block = _dbContext.LessonBlocks.FirstOrDefault(x => x.Id == idBlock);
            
            if (block == null)
            {
                return await Result<None>.SuccessAsync();
            }
            
            var validationResult = await _blockEngine.ValidateAsync(block.Type, block.Content);
            
            if(!validationResult.Succeeded)
            {
                return await Result<None>.FailureAsync(string.Join(", ", validationResult.Errors));
            }
            
            block.Content = request.Content;
            await _dbContext.SaveChangesAsync();
            
            return await Result<None>.SuccessAsync();
        }
        catch (Exception ex)
        {
            return await Result<None>.FailureAsync(ex.Message);
        }
    }

    public async Task<Result<None>> DeleteLessonBlock(Guid idBlock)
    {
        try
        {
            var block = _dbContext.LessonBlocks.FirstOrDefault(x => x.Id == idBlock);
            if (block == null)
            {
                return await Result<None>.SuccessAsync();
            }
            _dbContext.LessonBlocks.Remove(block);
            await _dbContext.SaveChangesAsync();
            return await Result<None>.SuccessAsync();
        }
        catch (Exception ex)
        {
            return await Result<None>.FailureAsync(ex.Message);
        }
    }
    
    public async Task<Result<None>> MoveBlock(Guid blockId, bool moveUp)
    {
        var block = await _dbContext.LessonBlocks
            .FirstOrDefaultAsync(x => x.Id == blockId);
    
        if (block == null)
            return await Result<None>.FailureAsync("Block not found");
    
        var neighbour = await _dbContext.LessonBlocks
            .Where(x => x.LessonId == block.LessonId &&
                        (moveUp ? x.OrderIndex < block.OrderIndex
                                : x.OrderIndex > block.OrderIndex))
            .OrderBy(x => moveUp ? -x.OrderIndex : x.OrderIndex)
            .FirstOrDefaultAsync();
    
        if (neighbour == null)
            return await Result<None>.SuccessAsync();
    
        (block.OrderIndex, neighbour.OrderIndex) =
            (neighbour.OrderIndex, block.OrderIndex);
    
        await _dbContext.SaveChangesAsync();
        return await Result<None>.SuccessAsync();
    }
}