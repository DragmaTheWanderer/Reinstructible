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
        public string? part_img_url { get; set; }

        public Element() { }
        public Element( string element_id,  string part_num_id,  int color_id, string? part_img_url)
        {
            this.element_id = element_id;
            this.part_num_id = part_num_id;
            this.color_id = color_id;
            this.part_img_url = part_img_url;
        }
        public Element(Models.Element vm)
        {
            this.element_id = vm.element_id;
            this.part_num_id = vm.part!.part_num;
            this.color_id = vm.color!.id;
            this.part_img_url = vm.part_img_url;
        }
        public void UpdateFrom(Models.Element vm)
        {
            this.part_num_id = vm.part!.part_num;
            this.color_id = vm.color!.id;
            this.part_img_url = vm.part_img_url;
        }
    }
}
#pragma warning restore IDE1006 // Naming Styles



