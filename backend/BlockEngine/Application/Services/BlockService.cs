using System.Text.Json;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using BlockEngine.Application.DTO;
using BlockEngine.Application.Interfaces;
using BlockEngine.Domain.Entities;
using BlockEngine.Domain.Enum;
using BlockEngine.Infrastructure;
using Contracts.Contracts.Blocks;
using Contracts.Services;
using Core;
using Microsoft.EntityFrameworkCore;

namespace BlockEngine.Application.Services;

public class BlockService : IBlockService, ILessonBlockStatsProvider
{
    private readonly ILessonBlockDbContext _dbContext;
    private readonly BlockEngine _blockEngine;
    private readonly IMapper _mapper;
    public readonly IBlockOrderService _blockOrderService;


    public BlockService(ILessonBlockDbContext dbContext, BlockEngine blockEngine, IMapper mapper, IBlockOrderService blockOrderService)
    {
        _dbContext = dbContext;
        _blockEngine = blockEngine;
        _mapper = mapper;
        _blockOrderService = blockOrderService;
    }


    public async Task<LessonBlockSummary?> GetBlockByIdAsync(Guid id)
    {
        return await _dbContext.LessonBlocks.Where(x => x.Id == id)
            .ProjectTo<LessonBlockSummary>(_mapper.ConfigurationProvider).FirstOrDefaultAsync();
        
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
            var preProcessResult = await _blockEngine.PreProcessAsync(request.Type, block.Content);
            if(!preProcessResult.Succeeded)
            {
                return await Result<Guid>.FailureAsync(string.Join(", ", preProcessResult.Errors));
            }

            var maxOrderIndex = await _dbContext.LessonBlocks
                .Where(x => x.LessonId == lessonId)
                .MaxAsync(x => (int?)x.OrderIndex) ?? -1;
            
            block.Content = preProcessResult.Data;
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

    public Task<bool> CheckBLock(BlockType type, JsonElement content, JsonElement payload)
    {
        return _blockEngine.CheckAsync(type, content, payload);
    }

    public Task<Result<None>> MoveBlock(Guid blockId, Guid? aboveId, Guid? belowId)
    {
       return _blockOrderService.MoveBlock(blockId, aboveId, belowId);
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
            
            var preProcessResult = await _blockEngine.PreProcessAsync(block.Type, request.Content);
            
            if(!preProcessResult.Succeeded)
            {
                return await Result<None>.FailureAsync(string.Join(", ",  preProcessResult.Errors));
            }

            block.Content = preProcessResult.Data;
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
            await _blockEngine.OnRemovingAsync(block.Type, block.Id, block.LessonId);
            return await Result<None>.SuccessAsync();
        }
        catch (Exception ex)
        {
            return await Result<None>.FailureAsync(ex.Message);
        }
    }


    public async Task<LessonBlockStatsDto> GetByLessonIdAsync(Guid lessonId)
    {
        var blocks = _dbContext.LessonBlocks.Where(x => x.LessonId == lessonId);

        return new LessonBlockStatsDto()
        {
            TotalBlocks = blocks.Count(),
            ScoredBlocks = blocks.Count(x => x.Type == BlockType.ChoiceQuestion || x.Type == BlockType.OpenQuestion)
        };
    }
}