

using Contracts.Contracts.Groups;

namespace Users.Application.DTO;

public class Student : UserDto
{
    public int Class { get; set; }
    public List<GroupPreview> Groups { get; set; }
    public int TotalCourses { get; set; }
}