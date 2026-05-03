using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RenameBlockEngagementTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_BlockEngagements",
                table: "BlockEngagements");

            migrationBuilder.RenameTable(
                name: "BlockEngagements",
                newName: "block_engagement");

            migrationBuilder.AddPrimaryKey(
                name: "PK_block_engagement",
                table: "block_engagement",
                column: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_block_engagement",
                table: "block_engagement");

            migrationBuilder.RenameTable(
                name: "block_engagement",
                newName: "BlockEngagements");

            migrationBuilder.AddPrimaryKey(
                name: "PK_BlockEngagements",
                table: "BlockEngagements",
                column: "id");
        }
    }
}
