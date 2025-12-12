#pragma warning disable IDE1006 // Naming Styles
using System.ComponentModel.DataAnnotations;

namespace Reinstructible.Server.DBModels
{
  

    public class Part
    {
        [Key]
        public string?  part_num    { get; set; }
        public string?  name        { get; set; }
        public int      part_cat_id { get; set; }
        public int      year_from   { get; set; }
        public int      year_to     { get; set; }
        public string? part_url { get; set; }


        public Part() { }
        public Part(string? part_num, string? name, int part_cat_id, int year_from, int year_to, string? part_url)
        {
            this.part_num = part_num;
            this.name = name;
            this.part_cat_id = part_cat_id;
            this.year_from = year_from;
            this.year_to = year_to;
            this.part_url = part_url;
        }
        public Part(Models.Part vm)
        {
            this.part_num = vm.part_num;
            this.name = vm.name;
            this.part_cat_id = vm.part_cat_id;
            this.year_from = vm.year_from;
            this.year_to = vm.year_to;
            this.part_url = vm.part_url;
            
        }

    }
}
#pragma warning restore IDE1006 // Naming Styles