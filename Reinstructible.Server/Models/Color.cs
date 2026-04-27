#pragma warning disable IDE1006 // Naming Styles
namespace Reinstructible.Server.Models
{
  public class Colors : BaseRecord
  {
    public Color[]? results { get; set; }
  }
  public class Color
  {
    public int   id   { get; set; }
    public string? name  { get; set; }
    public string? rgb   { get; set; }
    public bool   is_trans { get; set; }

    public Color() { }
    public Color(int id, string? name, string? rgb, bool is_trans)
    {
      this.id = id;
      this.name = name;
      this.rgb = rgb;
      this.is_trans = is_trans;
    }
    public Color(DBModels.Color dbm)
    {
      this.id = dbm.id;
      this.name = dbm.name;
      this.rgb = dbm.rgb;
      this.is_trans = dbm.is_trans;
    }

  }

}
#pragma warning restore IDE1006 // Naming Styles