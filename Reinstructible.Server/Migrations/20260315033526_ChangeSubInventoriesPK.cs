using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Reinstructible.Server.Migrations
{
    /// <inheritdoc />
    public partial class ChangeSubInventoriesPK : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_SubInventories",
                table: "SubInventories");

            migrationBuilder.AddColumn<int>(
                name: "id",
                table: "SubInventories",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_SubInventories",
                table: "SubInventories",
                columns: new[] { "id", "set_num", "element_id", "page", "step" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_SubInventories",
                table: "SubInventories");

            migrationBuilder.DropColumn(
                name: "id",
                table: "SubInventories");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SubInventories",
                table: "SubInventories",
                columns: new[] { "set_num", "element_id", "page", "step" });
        }
    }
}
