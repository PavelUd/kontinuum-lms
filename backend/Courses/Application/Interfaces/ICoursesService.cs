using Core;
using Courses.Domain.Entities;
using Courses.DTO;

namespace Courses.Application.Interfaces;

public interface ICoursesService
{
    public Result<List<CourseDTO>> GetCourses();
    public Result<CourseDTO> GetCourse(Guid courseId);
    public Result<Guid> CreateCourse(CourseCreateRequest request);
}