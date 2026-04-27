#pragma warning disable IDE1006 // Naming Styles
namespace Reinstructible.Server.Models
{
  public class PartCategorys : BaseRecord
  {
    public PartCategory[]? results { get; set; }
  }

  public class PartCategory
  {
    public int id { get; set; }
    public string? name { get; set; }
    public int part_count { get; set; }

    public PartCategory() { }
    public PartCategory(int id, string? name, int part_count)
    {
      this.id = id;
      this.name = name;
      this.part_count = part_count;
    }
    public PartCategory(DBModels.PartCategory dbm)
    {
      this.id = dbm.id;
      this.name = dbm.name;
      this.part_count = dbm.part_count;
    }
  }

}
#pragma warning restore IDE1006 // Naming Styles
