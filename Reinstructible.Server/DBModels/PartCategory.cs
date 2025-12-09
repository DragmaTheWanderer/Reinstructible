#pragma warning disable IDE1006 // Naming Styles
using System.ComponentModel.DataAnnotations;

namespace Reinstructible.Server.DBModels
{
     public class PartCategory
    {
        [Key]
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
        public PartCategory(Models.PartCategory vm)
        {
            this.id = vm.id;
            this.name = vm.name;
            this.part_count = vm.part_count;
        }

    }

}
#pragma warning restore IDE1006 // Naming Styles
