using System.ComponentModel.DataAnnotations.Schema;
using Core.Entities;

namespace Tracking.Domain;

[Table("block_engagement")]
public class BlockEngagement : BaseAuditableEntity
{
    [Column("block_id")] 
    public Guid BlockId { get; set; }

    [Column("lesson_id")] 
    public Guid LessonId { get; set; }

    [Column("views_count")]
    public int ViewsCount  { get; set; }
    
    [Column("avg_time_spent")]
    public double AvgTimeSpent { get; set; }
}
