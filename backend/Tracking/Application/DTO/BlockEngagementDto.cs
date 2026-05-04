using AutoMapper;
using Tracking.Domain;

namespace Tracking.Application.DTO;

public class BlockEngagementDto
{
    public Guid BlockId { get; set; }
    
    public Guid LessonId { get; set; }
    
    public int ViewsCount  { get; set; }
    
    public double AvgTimeSpent { get; set; }
    
    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<BlockEngagement, BlockEngagementDto>();
        }
    }
}