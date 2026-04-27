using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Reinstructible.Server.Migrations
{
  /// <inheritdoc />
  public partial class AddFieldToCompositeKey : Migration
  {
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      // 1. Drop the existing primary key constraint
      migrationBuilder.DropPrimaryKey(
        name: "PK_SubInventories", // Convention is PK_<TableName>
        table: "SubInventories");

      // 2. (Optional) Add the new column if it was not present before (EF might generate this part)
      // migrationBuilder.AddColumn<string>( ... ); 

      // 3. Add the new composite primary key constraint
      migrationBuilder.AddPrimaryKey(
        name: "PK_SubInventories",
        table: "SubInventories",
        columns: new[] { "set_num", "element_id", "page", "step" });
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
      // 1. Drop the existing primary key constraint
      migrationBuilder.DropPrimaryKey(
        name: "PK_SubInventories", // Convention is PK_<TableName>
        table: "SubInventories");

      // 2. (Optional) Add the new column if it was not present before (EF might generate this part)
      // migrationBuilder.AddColumn<string>( ... ); 

      // 3. Add the new composite primary key constraint
      migrationBuilder.AddPrimaryKey(
        name: "PK_SubInventories",
        table: "SubInventories",
        columns: new[] { "set_num", "element_id" });
    }
  }
}
