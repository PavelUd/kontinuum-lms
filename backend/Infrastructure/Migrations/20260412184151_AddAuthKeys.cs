using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAuthKeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_invite_links_user_id",
                table: "invite_links",
                column: "user_id",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_credentials_users_user_id",
                table: "credentials",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_invite_links_users_user_id",
                table: "invite_links",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_credentials_users_user_id",
                table: "credentials");

            migrationBuilder.DropForeignKey(
                name: "FK_invite_links_users_user_id",
                table: "invite_links");

            migrationBuilder.DropIndex(
                name: "IX_invite_links_user_id",
                table: "invite_links");
        }
    }
}
