using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDraftsMappingColums : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "draft_lesson_id",
                table: "lessons",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "draft_lesson_block_id",
                table: "lesson_blocks",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_lessons_draft_lesson_id",
                table: "lessons",
                column: "draft_lesson_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_lesson_blocks_draft_lesson_block_id",
                table: "lesson_blocks",
                column: "draft_lesson_block_id",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_lesson_blocks_lesson_blocks_draft_lesson_block_id",
                table: "lesson_blocks",
                column: "draft_lesson_block_id",
                principalTable: "lesson_blocks",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_lessons_lessons_draft_lesson_id",
                table: "lessons",
                column: "draft_lesson_id",
                principalTable: "lessons",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_lesson_blocks_lesson_blocks_draft_lesson_block_id",
                table: "lesson_blocks");

            migrationBuilder.DropForeignKey(
                name: "FK_lessons_lessons_draft_lesson_id",
                table: "lessons");

            migrationBuilder.DropIndex(
                name: "IX_lessons_draft_lesson_id",
                table: "lessons");

            migrationBuilder.DropIndex(
                name: "IX_lesson_blocks_draft_lesson_block_id",
                table: "lesson_blocks");

            migrationBuilder.DropColumn(
                name: "draft_lesson_id",
                table: "lessons");

            migrationBuilder.DropColumn(
                name: "draft_lesson_block_id",
                table: "lesson_blocks");
        }
    }
}
