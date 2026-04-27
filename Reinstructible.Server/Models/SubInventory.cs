#pragma warning disable IDE1006 // Naming Styles

namespace Reinstructible.Server.Models
{
  public class SubInventory
  {
    //Key combo
    public int id { get; set; } 
    public string? set_num { get; set; }
    public string? element_id { get; set; }

    //fields
    public int quantity { get; set; }
    public string? subBuildName { get; set; }
    public int page { get; set; }
    public int step { get; set; }

    public SubInventory() { }
    public SubInventory(int id, string? set_num, string? element_id, int quantity, string? subBuildName, int page, int step)
    {
      this.id = id;
      this.set_num = set_num;
      this.element_id = element_id;
      this.quantity = quantity;
      this.subBuildName = subBuildName;
      this.page = page;
      this.step = step;
    }

    public SubInventory(DBModels.SubInventory dbm)
    {
      this.id = dbm.id;
      this.set_num = dbm.set_num;
      this.element_id = dbm.element_id;
      this.quantity = dbm.quantity;
      this.subBuildName = dbm.subBuildName;
      this.page = dbm.page;
      this.step = dbm.step;
    }

  }
}
#pragma warning restore IDE1006 // Naming Styles
