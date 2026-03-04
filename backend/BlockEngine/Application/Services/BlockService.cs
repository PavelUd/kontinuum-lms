using System.Text.Json;
using AutoMapper;
using BlockEngine.Application.DTO;
using BlockEngine.Application.Interfaces;
using BlockEngine.Domain.Entities;
using BlockEngine.Infrastructure;
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

    public async Task<Result<List<LessonBlockDTO>>> GetBlockByLesson(Guid lessonId)
    {
        try
        {
            var blocks = await _dbContext.LessonBLocks
                .Where(x => x.LessonId == lessonId)
                .ToListAsync();

            var tasks = blocks.Select(async block =>
            {
                var dto = _mapper.Map<LessonBlockDTO>(block);
                var rendered = await _blockEngine.RenderAsync(block.Type, block.Content);
                dto.Content = rendered;

                return dto;
            });

            var result = await Task.WhenAll(tasks);

            return await Result<List<LessonBlockDTO>>.SuccessAsync(result.ToList());
        }
        catch (Exception ex)
        {
            return await Result<List<LessonBlockDTO>>.FailureAsync(ex.Message);
        }
    }

    public async Task<Result<Guid>> CreateLessonBlock(CreateBlockRequest request, Guid lessonId)
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
            
            _dbContext.LessonBLocks.Add(block);
            await _dbContext.SaveChangesAsync();
            return await Result<Guid>.SuccessAsync(block.Id);

        }
        catch (Exception ex)
        {
            return await Result<Guid>.FailureAsync(ex.Message);
        }
    }
}