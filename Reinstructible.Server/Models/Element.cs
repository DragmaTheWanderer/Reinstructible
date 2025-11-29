#pragma warning disable IDE1006 // Naming Styles\
namespace Reinstructible.Server.Models
{

    public class Elements : BaseRecord
    {
        public Element[]? results { get; set; }
    }

    public class Element
    {
        public int id { get; set; }
        public int inv_part_id { get; set; }
        public Part? part { get; set; }
        public Color? color { get; set; }
        public string? set_num { get; set; }
        public int quantity { get; set; }
        public bool is_spare { get; set; }
        public string? element_id { get; set; }
        public int num_sets { get; set; }
    }
}
#pragma warning restore IDE1006 // Naming Styles



