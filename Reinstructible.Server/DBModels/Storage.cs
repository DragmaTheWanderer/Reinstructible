#pragma warning disable IDE1006 // Naming Styles
using System.ComponentModel.DataAnnotations;

namespace Reinstructible.Server.DBModels
{
    public class Storage
    {
        [Key]
        public string? element_id { get; set; }
        public string? bin { get; set; }
        public string? drawer { get; set; }

        public Storage() { }
        public Storage(string? element_id, string? bin, string? drawer)
        {
            this.element_id = element_id;
            this.bin = bin;
            this.drawer = drawer;
        }
        public Storage(Models.Storage vm)
        {
            this.element_id = vm.element_id;
            this.bin = vm.bin;
            this.drawer = vm.drawer;
        }
    }

}
#pragma warning restore IDE1006 // Naming Styles