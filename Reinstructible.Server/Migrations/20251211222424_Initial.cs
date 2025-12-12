using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Reinstructible.Server.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Colors",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false),
                    name = table.Column<string>(type: "TEXT", nullable: true),
                    rgb = table.Column<string>(type: "TEXT", nullable: true),
                    is_trans = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Colors", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Elements",
                columns: table => new
                {
                    element_id = table.Column<string>(type: "TEXT", nullable: false),
                    part_num_id = table.Column<string>(type: "TEXT", nullable: true),
                    color_id = table.Column<int>(type: "INTEGER", nullable: false),
                    part_img_url = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Elements", x => x.element_id);
                });

            migrationBuilder.CreateTable(
                name: "Inventory",
                columns: table => new
                {
                    set_num = table.Column<string>(type: "TEXT", nullable: false),
                    element_id = table.Column<string>(type: "TEXT", nullable: false),
                    quantity = table.Column<int>(type: "INTEGER", nullable: false),
                    is_spare = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Inventory", x => new { x.set_num, x.element_id });
                });

            migrationBuilder.CreateTable(
                name: "LegoSets",
                columns: table => new
                {
                    set_num = table.Column<string>(type: "TEXT", nullable: false),
                    name = table.Column<string>(type: "TEXT", nullable: true),
                    year = table.Column<int>(type: "INTEGER", nullable: false),
                    theme_id = table.Column<int>(type: "INTEGER", nullable: false),
                    num_parts = table.Column<int>(type: "INTEGER", nullable: false),
                    set_img_url = table.Column<string>(type: "TEXT", nullable: true),
                    set_url = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LegoSets", x => x.set_num);
                });

            migrationBuilder.CreateTable(
                name: "PartCategorys",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false),
                    name = table.Column<string>(type: "TEXT", nullable: true),
                    part_count = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PartCategorys", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Parts",
                columns: table => new
                {
                    part_num = table.Column<string>(type: "TEXT", nullable: false),
                    name = table.Column<string>(type: "TEXT", nullable: true),
                    part_cat_id = table.Column<int>(type: "INTEGER", nullable: false),
                    year_from = table.Column<int>(type: "INTEGER", nullable: false),
                    year_to = table.Column<int>(type: "INTEGER", nullable: false),
                    part_url = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Parts", x => x.part_num);
                });

            migrationBuilder.CreateTable(
                name: "Storages",
                columns: table => new
                {
                    element_id = table.Column<string>(type: "TEXT", nullable: false),
                    bin = table.Column<string>(type: "TEXT", nullable: true),
                    drawer = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Storages", x => x.element_id);
                });

            migrationBuilder.CreateTable(
                name: "SubInventories",
                columns: table => new
                {
                    set_num = table.Column<string>(type: "TEXT", nullable: false),
                    element_id = table.Column<string>(type: "TEXT", nullable: false),
                    subBuildName = table.Column<string>(type: "TEXT", nullable: true),
                    page = table.Column<int>(type: "INTEGER", nullable: false),
                    step = table.Column<int>(type: "INTEGER", nullable: false),
                    quantity = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubInventories", x => new { x.set_num, x.element_id });
                });

            migrationBuilder.CreateTable(
                name: "Themes",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false),
                    parent_id = table.Column<int>(type: "INTEGER", nullable: true),
                    name = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Themes", x => x.id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Colors");

            migrationBuilder.DropTable(
                name: "Elements");

            migrationBuilder.DropTable(
                name: "Inventory");

            migrationBuilder.DropTable(
                name: "LegoSets");

            migrationBuilder.DropTable(
                name: "PartCategorys");

            migrationBuilder.DropTable(
                name: "Parts");

            migrationBuilder.DropTable(
                name: "Storages");

            migrationBuilder.DropTable(
                name: "SubInventories");

            migrationBuilder.DropTable(
                name: "Themes");
        }
    }
}
