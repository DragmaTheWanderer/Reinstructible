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

        public Storage? storage_location {  get; set; }
        public SubInventory[]? sub_inventory { get; set; }

        public Element() { }
        public Element(string element_id, string set_num, int quantity, bool is_spare)
        {
            this.element_id = element_id;
            this.set_num = set_num;
            this.quantity = quantity;
            this.is_spare = is_spare;
        }
        public Element(DBModels.Element dbm)
        {
            this.element_id = dbm.element_id;
            this.set_num = dbm.set_num;
            this.quantity = dbm.quantity;
            this.is_spare = dbm.is_spare;
        }
        public Element(DBModels.Element dbm, Color color, Part part)
        {
            this.element_id = dbm.element_id;
            this.set_num = dbm.set_num;
            this.quantity = dbm.quantity;
            this.is_spare = dbm.is_spare;
            this.color = color;
            this.part = part;
        }


    }
}
#pragma warning restore IDE1006 // Naming Styles



