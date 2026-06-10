using System.Text.Json;
using BlockEngine.Application.Plugins.Text;
using BlockEngine.Domain.Entities;
using BlockEngine.Domain.Enum;
using Core.Entities;
using Courses.Domain.Entities;
using Courses.Domain.Enums;
using Groups.Domain;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Users.Domain;

namespace IntegrationTests.Seed;

public static class TestDataSeeder
{
    public static readonly Guid CourseId = Guid.Parse("10000000-0000-0000-0000-000000000001");

    public static readonly Guid LessonId = Guid.Parse("20000000-0000-0000-0000-000000000001");
    public static readonly Guid ActiveLessonId = Guid.Parse("20000000-0000-0000-0000-000000000002");
    public static readonly Guid DraftLessonId = Guid.Parse("20000000-0000-0000-0000-000000000003");

    public static readonly Guid TextBlockId = Guid.Parse("30000000-0000-0000-0000-000000000001");
    public static readonly Guid QuestionBlockId = Guid.Parse("30000000-0000-0000-0000-000000000002");

    public static readonly Guid AdminId = Guid.Parse("40000000-0000-0000-0000-000000000001");
    public static readonly Guid EmployeeId = Guid.Parse("40000000-0000-0000-0000-000000000002");
    public static readonly Guid StudentId = Guid.Parse("50000000-0000-0000-0000-000000000001");
    
    public static readonly Guid GroupId = Guid.Parse("60000000-0000-0000-0000-000000000001");
    public static readonly Guid GroupMemberId = Guid.Parse("60000000-0000-0000-0000-000000000002");

    public static async Task SeedAsync(AppDbContext dbContext)
    {
        await SeedCoursesAsync(dbContext);
        await SeedUsersAsync(dbContext);
        await SeedLessonsAsync(dbContext);
        await SeedGroupsAsync(dbContext);
        await SeedLessonBlocksAsync(dbContext);

        await dbContext.SaveChangesAsync();
    }

    private static async Task SeedCoursesAsync(AppDbContext dbContext)
    {
        if (await dbContext.Courses.AnyAsync(x => x.Id == CourseId))
            return;

        var course = new Course
        {
            Id = CourseId,
            Name = "Тестовый курс",
            Status = Status.Archived,
            CreatedDate = DateTime.UtcNow,
            AvatarUrl = "hello",
            UpdatedDate = DateTime.UtcNow
        };

        await dbContext.Courses.AddAsync(course);
    }
    
    private static async Task SeedUsersAsync(AppDbContext dbContext)
    {
        if (!await dbContext.Users.AnyAsync(x => x.Id == AdminId))
        {
            var admin = new User
            {
                Id = AdminId,
                FullName = "Admin",
                Email = "admin@gmail.com",
                Phone = "+70000000001",
                Role = Role.Admin,
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            };

            await dbContext.Users.AddAsync(admin);
        }

        if (!await dbContext.Users.AnyAsync(x => x.Id == EmployeeId))
        {
            var employee = new User
            {
                Id = EmployeeId,
                FullName = "Employee",
                Email = "employee@gmail.com",
                Phone = "+70000000002",
                Role = Role.Methodist,
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            };
            
            await dbContext.Users.AddAsync(employee);
        }
        
        if (!await dbContext.Users.AnyAsync(x => x.Id == StudentId))
        {
            var student = new User
            {
                Id = StudentId,
                FullName = "Student Test",
                Email = "student@gmail.com",
                Phone = "+70000000003",
                Role = Role.Student,
                Status = UserStatus.Active,
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            };

            await dbContext.Users.AddAsync(student);
        }
    }

    private static async Task SeedLessonBlocksAsync(AppDbContext dbContext)
    {
        if (!await dbContext.Lessons.AnyAsync(x => x.Id == TextBlockId))
        {
            var block = new LessonBlock()
            {
                Id = TextBlockId,
                LessonId = DraftLessonId,
                Type = BlockType.Text,
                Content = CreateJsonElement("""
                                            {
                                                "text": "Тестовый текстовый блок"
                                            }
                                            """),
                OrderIndex = 0 
            };
            
            await dbContext.LessonBlocks.AddAsync(block);
        }
        if (!await dbContext.LessonBlocks.AnyAsync(x => x.Id == QuestionBlockId))
        {
            var questionBlock = new LessonBlock
            {
                Id = QuestionBlockId,
                LessonId = LessonId,
                Type = BlockType.OpenQuestion,
                OrderIndex = 2,
                Content = CreateJsonElement("""
                                            {
                                                "question": "Тестовый вопрос",
                                                "answers": [
                                                    {
                                                        "id": "1",
                                                        "text": "Ответ 1",
                                                        "isCorrect": true
                                                    }
                                                ]
                                            }
                                            """)
            };
            await dbContext.LessonBlocks.AddAsync(questionBlock);
        }
    }
    
    private static async Task SeedLessonsAsync(AppDbContext dbContext)
    {
        if (!await dbContext.Lessons.AnyAsync(x => x.Id == LessonId))
        {
            var lesson = new Lesson
            {
                Id = LessonId,
                CourseId = CourseId,
                Title = "Тестовый урок",
                Status = Status.Active,
                OrderIndex = 1,
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            };

            await dbContext.Lessons.AddAsync(lesson);
        }

        if (!await dbContext.Lessons.AnyAsync(x => x.Id == ActiveLessonId))
        {
            var activeLesson = new Lesson
            {
                Id = ActiveLessonId,
                CourseId = CourseId,
                Title = "Активный урок",
                Status = Status.Active,
                OrderIndex = 2,
                DraftLessonId = DraftLessonId,
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            };

            await dbContext.Lessons.AddAsync(activeLesson);
        }

        if (!await dbContext.Lessons.AnyAsync(x => x.Id == DraftLessonId))
        {
            var draftLesson = new Lesson
            {
                Id = DraftLessonId,
                CourseId = CourseId,
                Title = "Черновик урока",
                Status = Status.Draft,
                OrderIndex = 2,
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            };

            await dbContext.Lessons.AddAsync(draftLesson);
        }
    }
    
    private static async Task SeedGroupsAsync(AppDbContext dbContext)
    {
        if (!await dbContext.Groups.AnyAsync(x => x.Id == GroupId))
        {
            var group = new Group
            {
                Id = GroupId,
                Title = "Тестовая группа",
                CourseId = CourseId,
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            };

            await dbContext.Groups.AddAsync(group);
        }

        if (!await dbContext.GroupMembers.AnyAsync(x => x.Id == GroupMemberId))
        {
            var groupMember = new GroupMember
            {
                Id = GroupMemberId,
                GroupId = GroupId,
                UserId = StudentId,
                Role = GroupRole.Student,
                JoinedAt = DateTime.UtcNow
            };

            await dbContext.GroupMembers.AddAsync(groupMember);
        }
    }
    
    private static JsonElement CreateJsonElement(string json)
    {
        using var document = JsonDocument.Parse(json);
        return document.RootElement.Clone();
    }
}