using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Reinstructible.Server.Migrations
{
    /// <inheritdoc />
    public partial class SubInventoryNewPK : Migration
    {
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

            migrationBuilder.AlterColumn<int>(
                name: "id",
                table: "SubInventories",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .Annotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_SubInventories",
                table: "SubInventories",
                column: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_SubInventories",
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

            migrationBuilder.AlterColumn<int>(
                name: "id",
                table: "SubInventories",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .OldAnnotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_SubInventories",
                table: "SubInventories",
                columns: new[] { "id", "set_num", "element_id", "page", "step" });
        }
    }
}
