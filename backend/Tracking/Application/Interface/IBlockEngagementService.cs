using Tracking.Application.DTO;

namespace Tracking.Application.Interface;

public interface IBlockEngagementService
{
    public List<BlockEngagementDto> GetLessonEngagementStats(Guid lessonId);
}