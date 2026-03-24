using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCascadeDeleteCourses : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CourseId1",
                table: "lessons",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_lessons_CourseId1",
                table: "lessons",
                column: "CourseId1");

            migrationBuilder.CreateIndex(
                name: "IX_lesson_progresses_lesson_id",
                table: "lesson_progresses",
                column: "lesson_id");

            migrationBuilder.CreateIndex(
                name: "IX_lesson_blocks_lesson_id",
                table: "lesson_blocks",
                column: "lesson_id");

            migrationBuilder.AddForeignKey(
                name: "FK_lesson_blocks_lessons_lesson_id",
                table: "lesson_blocks",
                column: "lesson_id",
                principalTable: "lessons",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_lesson_progresses_lessons_lesson_id",
                table: "lesson_progresses",
                column: "lesson_id",
                principalTable: "lessons",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_lessons_courses_CourseId1",
                table: "lessons",
                column: "CourseId1",
                principalTable: "courses",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_lesson_blocks_lessons_lesson_id",
                table: "lesson_blocks");

            migrationBuilder.DropForeignKey(
                name: "FK_lesson_progresses_lessons_lesson_id",
                table: "lesson_progresses");

            migrationBuilder.DropForeignKey(
                name: "FK_lessons_courses_CourseId1",
                table: "lessons");

            migrationBuilder.DropIndex(
                name: "IX_lessons_CourseId1",
                table: "lessons");

            migrationBuilder.DropIndex(
                name: "IX_lesson_progresses_lesson_id",
                table: "lesson_progresses");

            migrationBuilder.DropIndex(
                name: "IX_lesson_blocks_lesson_id",
                table: "lesson_blocks");

            migrationBuilder.DropColumn(
                name: "CourseId1",
                table: "lessons");
        }
    }
}
