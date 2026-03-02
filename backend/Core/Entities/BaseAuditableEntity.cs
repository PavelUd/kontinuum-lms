using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities;

public class BaseAuditableEntity : BaseEntity
{
    [Column("created_at")] 
    public DateTime? CreatedDate { get; set; } = DateTime.Now.ToUniversalTime();

    [Column("updated_at")]
    public DateTime? UpdatedDate { get; set; } = DateTime.Now.ToUniversalTime();
}