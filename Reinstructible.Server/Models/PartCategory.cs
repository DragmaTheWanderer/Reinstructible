#pragma warning disable IDE1006 // Naming Styles
using System.ComponentModel.DataAnnotations;

namespace Reinstructible.Server.Models
{
    public class PartCategorys : BaseRecord
    {
        public PartCategory[]? results { get; set; }
    }

    public class PartCategory
    {
        [Key]
        public int id { get; set; }
        public string? name { get; set; }
        public int part_count { get; set; }
    }

}
#pragma warning restore IDE1006 // Naming Styles
