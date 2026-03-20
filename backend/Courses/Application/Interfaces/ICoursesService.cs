using Core;
using Courses.Domain.Entities;
using Courses.Domain.Enums;
using Courses.DTO;
using Courses.DTO.Courses;

namespace Courses.Application.Interfaces;

public interface ICoursesService
{
    public Result<List<SummaryCourseDto>> GetCourses();
    public Result<CourseDto> GetCourse(Guid courseId);
    public Result<Guid> CreateCourse(CourseCreateRequest request);
    public Task<Result<None>> SetStatus(Status status, Guid idCourse);
    public Task<Result<None>> DeleteCourse(Guid idCourse);
}