#pragma warning disable IDE1006 // Naming Styles
using System.ComponentModel.DataAnnotations;

namespace Reinstructible.Server.Models
{
    public class Colors : BaseRecord
    {
        public Color[]? results { get; set; }
    }
    public class Color
    {
        [Key]
        public int      id      { get; set; }
        public string?  name    { get; set; }
        public string?  rgb     { get; set; }
        public bool     is_trans { get; set; }
        //public External_Ids_Color? external_ids { get; set; }
    }

}
#pragma warning restore IDE1006 // Naming Styles