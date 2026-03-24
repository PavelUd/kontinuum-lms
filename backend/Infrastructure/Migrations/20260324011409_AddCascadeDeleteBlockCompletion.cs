using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCascadeDeleteBlockCompletion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_block_completions_block_id",
                table: "block_completions",
                column: "block_id");

            migrationBuilder.AddForeignKey(
                name: "FK_block_completions_lesson_blocks_block_id",
                table: "block_completions",
                column: "block_id",
                principalTable: "lesson_blocks",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_block_completions_lesson_blocks_block_id",
                table: "block_completions");

            migrationBuilder.DropIndex(
                name: "IX_block_completions_block_id",
                table: "block_completions");
        }
    }
}
