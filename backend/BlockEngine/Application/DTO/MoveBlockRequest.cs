namespace BlockEngine.Application.DTO;

public class MoveBlockRequest
{
    public Guid? AboveBlockId { get; set; }

    public Guid? BelowBlockId { get; set; }
}