using AutoMapper;
using Core;
using Microsoft.EntityFrameworkCore;
using Tracking.Application.DTO;
using Tracking.Application.Interface;
using Tracking.Domain;
using Tracking.Infrastructure;

namespace Tracking.Application;

public class TrackingService : ITrackingService
{
    
    private readonly ITrackingDbContext _context;
    private readonly IMapper _mapper;
    
    public TrackingService(ITrackingDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }
    
    public async Task<Result<None>> SaveAttempt(SaveAttemptRequest request)
    {
        const int maxAttempts = 1;

        using var transaction = await _context.BeginTransactionAsync();

        var attemptsCount = await _context.AnswerAttempts
            .Where(x => x.UserId == request.UserId && x.BlockId == request.BlockId)
            .CountAsync();

        if (attemptsCount >= maxAttempts)
        {
            return await Result<None>.FailureAsync("Превышено количество попыток");
        }

        var attempt = _mapper.Map<AnswerAttempt>(request);
        _context.AnswerAttempts.Add(attempt);

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return await Result<None>.SuccessAsync();
    }
}