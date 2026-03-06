

namespace Contracts.Contracts;

public class LessonBlockDto
{
    public Guid Id { get; set; }
    
    public Guid LessonId { get; set; }
    
    public int OrderIndex { get; set; }
    
    public string  Type { get; set; }
    
    public object Content  { get; set; }
}