#pragma warning disable IDE1006 // Naming Styles
using System.ComponentModel.DataAnnotations;

namespace Reinstructible.Server.DBModels
{
  
  
    public class LegoSet
    {
        [Key]
        public string? set_num { get; set; }
        public string? name { get; set; }
        public int year { get; set; }
        public int theme_id { get; set; }
        public int num_parts { get; set; }
        public string? set_img_url { get; set; }
        public string? set_url { get; set; }

        public LegoSet() { }
        public LegoSet(string? set_num, string? name, int year, int theme_id, int num_parts, string? set_img_url, string? set_url)
        {
            this.set_num = set_num;
            this.name = name;
            this.year = year;
            this.theme_id = theme_id;
            this.num_parts = num_parts;
            this.set_img_url = set_img_url;
            this.set_url = set_url;
        }
        public LegoSet(Models.LegoSet vm)
        {
            this.set_num = vm.set_num;
            this.name = vm.name;
            this.year = vm.year;
            this.theme_id = vm.theme_id;
            this.num_parts = vm.num_parts;
            this.set_img_url = vm.set_img_url;
            this.set_url = vm.set_url;
        }

        internal void updateFromModel(Models.LegoSet vm)
        {
            this.name = vm.name;
            this.year = vm.year;
            this.theme_id = vm.theme_id;
            this.num_parts = vm.num_parts;
            this.set_img_url = vm.set_img_url;
            this.set_url = vm.set_url;
        }
    }

}
#pragma warning restore IDE1006 // Naming Styles