using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateLessonProgressTableName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_LessonProgresses",
                table: "LessonProgresses");

            migrationBuilder.RenameTable(
                name: "LessonProgresses",
                newName: "lesson_progresses");

            migrationBuilder.AddPrimaryKey(
                name: "PK_lesson_progresses",
                table: "lesson_progresses",
                column: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_lesson_progresses",
                table: "lesson_progresses");

            migrationBuilder.RenameTable(
                name: "lesson_progresses",
                newName: "LessonProgresses");

            migrationBuilder.AddPrimaryKey(
                name: "PK_LessonProgresses",
                table: "LessonProgresses",
                column: "id");
        }
    }
}
