using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Reinstructible.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Colors",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    name = table.Column<string>(type: "TEXT", nullable: true),
                    rgb = table.Column<string>(type: "TEXT", nullable: true),
                    is_trans = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Colors", x => x.id);
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
                    set_url = table.Column<string>(type: "TEXT", nullable: true),
                    last_modified_dt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LegoSets", x => x.set_num);
                });

            migrationBuilder.CreateTable(
                name: "PartCategorys",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
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
                    part_url = table.Column<string>(type: "TEXT", nullable: true),
                    part_img_url = table.Column<string>(type: "TEXT", nullable: true),
                    prints = table.Column<string>(type: "TEXT", nullable: true),
                    molds = table.Column<string>(type: "TEXT", nullable: true),
                    alternates = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Parts", x => x.part_num);
                });

            migrationBuilder.CreateTable(
                name: "Storages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    element_id = table.Column<string>(type: "TEXT", nullable: true),
                    Bin = table.Column<string>(type: "TEXT", nullable: true),
                    Drawer = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Storages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Themes",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    parent_id = table.Column<int>(type: "INTEGER", nullable: true),
                    name = table.Column<string>(type: "TEXT", nullable: true),
                    LegoSetset_num = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Themes", x => x.id);
                    table.ForeignKey(
                        name: "FK_Themes_LegoSets_LegoSetset_num",
                        column: x => x.LegoSetset_num,
                        principalTable: "LegoSets",
                        principalColumn: "set_num");
                });

            migrationBuilder.CreateTable(
                name: "Elements",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    inv_part_id = table.Column<int>(type: "INTEGER", nullable: false),
                    part_num = table.Column<string>(type: "TEXT", nullable: true),
                    colorid = table.Column<int>(type: "INTEGER", nullable: true),
                    set_num = table.Column<string>(type: "TEXT", nullable: true),
                    quantity = table.Column<int>(type: "INTEGER", nullable: false),
                    is_spare = table.Column<bool>(type: "INTEGER", nullable: false),
                    element_id = table.Column<string>(type: "TEXT", nullable: true),
                    num_sets = table.Column<int>(type: "INTEGER", nullable: false),
                    storage_locationId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Elements", x => x.id);
                    table.ForeignKey(
                        name: "FK_Elements_Colors_colorid",
                        column: x => x.colorid,
                        principalTable: "Colors",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_Elements_Parts_part_num",
                        column: x => x.part_num,
                        principalTable: "Parts",
                        principalColumn: "part_num");
                    table.ForeignKey(
                        name: "FK_Elements_Storages_storage_locationId",
                        column: x => x.storage_locationId,
                        principalTable: "Storages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SubInventories",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    set_num = table.Column<string>(type: "TEXT", nullable: true),
                    element_id = table.Column<string>(type: "TEXT", nullable: true),
                    quantity = table.Column<int>(type: "INTEGER", nullable: false),
                    subBuildName = table.Column<string>(type: "TEXT", nullable: false),
                    page = table.Column<int>(type: "INTEGER", nullable: false),
                    step = table.Column<int>(type: "INTEGER", nullable: false),
                    Elementid = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubInventories", x => x.id);
                    table.ForeignKey(
                        name: "FK_SubInventories_Elements_Elementid",
                        column: x => x.Elementid,
                        principalTable: "Elements",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Elements_colorid",
                table: "Elements",
                column: "colorid");

            migrationBuilder.CreateIndex(
                name: "IX_Elements_part_num",
                table: "Elements",
                column: "part_num");

            migrationBuilder.CreateIndex(
                name: "IX_Elements_storage_locationId",
                table: "Elements",
                column: "storage_locationId");

            migrationBuilder.CreateIndex(
                name: "IX_SubInventories_Elementid",
                table: "SubInventories",
                column: "Elementid");

            migrationBuilder.CreateIndex(
                name: "IX_Themes_LegoSetset_num",
                table: "Themes",
                column: "LegoSetset_num");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PartCategorys");

            migrationBuilder.DropTable(
                name: "SubInventories");

            migrationBuilder.DropTable(
                name: "Themes");

            migrationBuilder.DropTable(
                name: "Elements");

            migrationBuilder.DropTable(
                name: "LegoSets");

            migrationBuilder.DropTable(
                name: "Colors");

            migrationBuilder.DropTable(
                name: "Parts");

            migrationBuilder.DropTable(
                name: "Storages");
        }
    }
}
