#pragma warning disable IDE1006 // Naming Styles\
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Reinstructible.Server.DBModels
{

   
    public class Element
    {
        [Key]
        public string? element_id { get; set; }
        public string? part_num_id { get; set; }
        public int color_id { get; set; }
        public string? set_num { get; set; }
        public int quantity { get; set; }
        public bool is_spare { get; set; }

        public Element() { }
        public Element( string element_id,  string part_num_id,  int color_id, string set_num,  int quantity,  bool is_spare )
        {
            this.element_id = element_id;
            this.part_num_id = part_num_id;
            this.color_id = color_id;
            this.set_num = set_num;
            this.quantity = quantity;
            this.is_spare = is_spare;
        }
        public Element(Models.Element vm)
        {
            this.element_id = vm.element_id;
            this.part_num_id = vm.part!.part_num;
            this.color_id = vm.color!.id;
            this.set_num = vm.set_num;
            this.quantity = vm.quantity;
            this.is_spare = vm.is_spare;
        }
    }
}
#pragma warning restore IDE1006 // Naming Styles



