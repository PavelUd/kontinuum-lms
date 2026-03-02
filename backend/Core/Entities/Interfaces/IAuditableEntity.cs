namespace Core.Entities.Interfaces;

public interface IAuditableEntity
{
    DateTime? CreatedDate { get; set; }
    DateTime? UpdatedDate { get; set; }
}