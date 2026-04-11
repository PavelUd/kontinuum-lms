using AutoMapper;
using AutoMapper.QueryableExtensions;
using Contracts.Contracts.Groups;
using Contracts.Services;
using Core.Common.Extensions;
using Core.Common.Pagination;
using Core.Entities;
using Users.Application.DTO;
using Users.Application.Interfaces;
using Users.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Users.Application;

public class StudentService : IStudentService
{
    private readonly IUsersDbContext _context;
    private readonly IMapper _mapper;
    private readonly IGroupProvider _provider;

    public StudentService(IUsersDbContext context, IMapper mapper, IGroupProvider provider)
    {
        _context = context;
        _mapper = mapper;
        _provider = provider;
    }

    public async Task<PagedResult<Student>> GetStudents(GetStudentsQuery request)
    {
        var query = _context.Users.Include(x => x.StudentProfile)
            .Where(x => x.Role == Role.Student);
        
        if (!string.IsNullOrWhiteSpace(request.StudentName))
        {
            query = query.Where(x =>
                EF.Functions.ILike(x.FullName, $"{request.StudentName}%")
            );
        }
        
        if (request.Status.HasValue)
        {
            query = query.Where(x => x.Status == request.Status.Value);
        }
        
        if (request.Class.HasValue)
        {
            query = query.Where(x => x.StudentProfile != null && x.StudentProfile.Class == request.Class.Value);
        }
        
        var studentPage = await query.OrderByDescending(u => u.CreatedDate)
            .ProjectTo<Student>(_mapper.ConfigurationProvider)
            .ToPagedResultAsync(request.Page, request.PageSize);


        var groups = _provider.GetMembersGroups(studentPage.Items.Select(x => x.Id).ToList());
       
        foreach (var item in studentPage.Items)
        {
            item.Groups = new List<GroupPreview>();
           
            if (!groups.TryGetValue(item.Id, out var studentGroups)) 
                continue;
           
            item.Groups = studentGroups;
            item.TotalCourses = studentGroups
                .Select(x => x.CourseId)
                .Distinct()
                .Count();
        }

        return studentPage;
    }
}