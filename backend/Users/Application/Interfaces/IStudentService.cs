using Core.Common.Pagination;
using Users.Application.DTO;

namespace Users.Application.Interfaces;

public interface IStudentService
{
    public Task<PagedResult<Student>> GetStudents(GetStudentsQuery request);
}