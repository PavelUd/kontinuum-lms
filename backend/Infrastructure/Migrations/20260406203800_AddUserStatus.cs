using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUserStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_lessons_courses_CourseId1",
                table: "lessons");

            migrationBuilder.DropIndex(
                name: "IX_lessons_CourseId1",
                table: "lessons");

            migrationBuilder.DropColumn(
                name: "CourseId1",
                table: "lessons");

            migrationBuilder.AddColumn<string>(
                name: "status",
                table: "users",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "status",
                table: "users");

            migrationBuilder.AddColumn<Guid>(
                name: "CourseId1",
                table: "lessons",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_lessons_CourseId1",
                table: "lessons",
                column: "CourseId1");

            migrationBuilder.AddForeignKey(
                name: "FK_lessons_courses_CourseId1",
                table: "lessons",
                column: "CourseId1",
                principalTable: "courses",
                principalColumn: "id");
        }
    }
}
