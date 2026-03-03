using Core;
using Courses.Domain.Entities;
using Courses.DTO;
using Courses.DTO.Courses;

namespace Courses.Application.Interfaces;

public interface ICoursesService
{
    public Result<List<SummaryCourseDto>> GetCourses();
    public Result<CourseDto> GetCourse(Guid courseId);
    public Result<Guid> CreateCourse(CourseCreateRequest request);
}