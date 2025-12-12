#pragma warning disable IDE1006 // Naming Styles\
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Reinstructible.Server.DBModels
{

    [PrimaryKey(nameof(set_num), nameof(element_id))]
    public class Inventory
    {
        //Key combo
        public string? set_num { get; set; }
        public string? element_id { get; set; }
       
        public int quantity { get; set; }
        public bool is_spare { get; set; }
      
        public Inventory() { }
        public Inventory(string set_num, string element_id, int quantity, bool is_spare)
        {
            this.set_num = set_num;
            this.element_id = element_id;
            this.quantity = quantity;
            this.is_spare = is_spare;
        }
        public Inventory(Models.Element vm)
        {
            this.set_num = vm.set_num;
            this.element_id = vm.element_id;
            this.quantity = vm.quantity;
            this.is_spare = vm.is_spare;
        }
    }
}
#pragma warning restore IDE1006 // Naming Styles



