using AutoMapper;
using AutoMapper.QueryableExtensions;
using Tracking.Application.DTO;
using Tracking.Application.Interface;
using Tracking.Infrastructure;

namespace Tracking.Application;

public class BlockEngagementService : IBlockEngagementService
{
    private readonly ITrackingDbContext _context;
    private readonly IMapper _mapper;

    public BlockEngagementService(ITrackingDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }
    public List<BlockEngagementDto> GetLessonEngagementStats(Guid lessonId)
    {
        return _context.BlockEngagements
            .Where(x => x.LessonId == lessonId)
            .ProjectTo<BlockEngagementDto>(_mapper.ConfigurationProvider).ToList();
    }
}