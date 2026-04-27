#pragma warning disable IDE1006 // Naming Styles
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Reinstructible.Server.DBModels
{
  [PrimaryKey(nameof(id))]
  public class SubInventory
  {
    //Key combo
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int id { get; set; }
    public string? set_num { get; set; }
    public string? element_id { get; set; }

    //fields
    public string? subBuildName { get; set; }
    public int page { get; set; }
    public int step { get; set; }
    public int quantity { get; set; }

    public SubInventory() { }
    public SubInventory(int id, string set_num, string element_id, string subBuildName, int page, int step, int quantity)
    {
      this.id = id;
      this.set_num = set_num;
      this.element_id = element_id;
      this.subBuildName = subBuildName;
      this.page = page;
      this.step = step;
      this.quantity = quantity;
    }

    public SubInventory(Models.SubInventory vm)
    {
      this.id = vm.id;
      this.set_num = vm.set_num;
      this.element_id = vm.element_id;
      this.subBuildName = vm.subBuildName;
      this.page = vm.page;
      this.step = vm.step;
      this.quantity = vm.quantity;
    }
  }
}
#pragma warning restore IDE1006 // Naming Styles
