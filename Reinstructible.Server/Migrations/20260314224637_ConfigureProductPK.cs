using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Reinstructible.Server.Migrations
{
    /// <inheritdoc />
    public partial class ConfigureProductPK : Migration
    {
        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_SubInventories",
                table: "SubInventories");

            migrationBuilder.DropColumn(
                name: "id",
                table: "SubInventories");

            migrationBuilder.AlterColumn<string>(
                name: "set_num",
                table: "SubInventories",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "element_id",
                table: "SubInventories",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_SubInventories",
                table: "SubInventories",
                columns: new[] { "set_num", "element_id", "page", "step" });
        }

        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_SubInventories",
                table: "SubInventories");

            migrationBuilder.AlterColumn<string>(
                name: "element_id",
                table: "SubInventories",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<string>(
                name: "set_num",
                table: "SubInventories",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AddColumn<int>(
                name: "id",
                table: "SubInventories",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_SubInventories",
                table: "SubInventories",
                column: "id");
        }
    }
}
