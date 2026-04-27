#pragma warning disable IDE1006 // Naming Styles

namespace Reinstructible.Server.Models
{
  public class Themes : BaseRecord
  {
    public Theme[]? results { get; set; }
  }
  public class Theme
  {
    public int id { get; set; }
    public int? parent_id { get; set; }
    public string? name { get; set; }

    public Theme() { }
    public Theme(int id, string name, int? parent_id = null)
    {
      this.id = id;
      this.name = name;
      this.parent_id = parent_id;
    }
    public Theme(DBModels.Theme dbm)
    {
      this.id = dbm.id;
      this.name = dbm.name;
      this.parent_id = dbm.parent_id;
    }

  }

}
#pragma warning restore IDE1006 // Naming Styles