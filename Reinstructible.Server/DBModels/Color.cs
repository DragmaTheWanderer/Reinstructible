#pragma warning disable IDE1006 // Naming Styles
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Reinstructible.Server.DBModels
{
    public class Color
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int      id      { get; set; }
        public string?  name    { get; set; }
        public string?  rgb     { get; set; }
        public bool     is_trans { get; set; }

        public Color() { }
        public Color(int id, string? name, string? rgb, bool is_trans)
        {
            this.id = id;
            this.name = name;
            this.rgb = rgb;
            this.is_trans = is_trans;
        }
        public Color(Models.Color vm)
        {
            this.id = vm.id;
            this.name = vm.name;
            this.rgb = vm.rgb;
            this.is_trans = vm.is_trans;
        }
    }
}
#pragma warning restore IDE1006 // Naming Styles