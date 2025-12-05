#pragma warning disable IDE1006 // Naming Styles
using System.ComponentModel.DataAnnotations;

namespace Reinstructible.Server.Models
{
    public class Themes : BaseRecord
    {
        public Theme[]? results { get; set; }
    }
    public class Theme
    {
        [Key]
        public int id { get; set; }
        public int? parent_id { get; set; }
        public string? name { get; set; }
    }

}
#pragma warning restore IDE1006 // Naming Styles