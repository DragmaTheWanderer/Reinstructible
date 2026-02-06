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
        public string? part_img_url { get; set; }
        public string? alt_part_img_url { get; set; }
        public string? part_url { get; set; }

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
        //public Element(DBModels.Element dbm)
        //{
        //    this.element_id = dbm.element_id;
        //    this.part_img_url = dbm.part_img_url;
        //    this.color_id = dbm.color_id;
        //    this.part_num_id = dbm.part_num_id;
        //}
        public Element(DBModels.Inventory dbm)
        {
            this.element_id = dbm.element_id;
            this.set_num = dbm.set_num;
            this.quantity = dbm.quantity;
            this.is_spare = dbm.is_spare;
        }
        public Element(DBModels.Element dbe, DBModels.Inventory dbi, Color color, Part part,Storage storage)
        {
            this.element_id = dbe.element_id;
            this.set_num = dbi.set_num;
            this.quantity = dbi.quantity;
            this.is_spare = dbi.is_spare;
            this.color = color;
            this.part = part;
            this.part_img_url = dbe.part_img_url;
            this.alt_part_img_url = string.Format("https://cdn.rebrickable.com/media/parts/elements/{0}.jpg", dbe.element_id);
            this.storage_location = storage;
        }
        public Element(DBModels.Element dbe, Color color, Part part, Storage storage)
        {
            this.element_id = dbe.element_id;
            this.alt_part_img_url = string.Format("https://cdn.rebrickable.com/media/parts/elements/{0}.jpg", dbe.element_id);
            this.color = color;
            this.part = part;
            this.part_img_url = dbe.part_img_url;
            this.storage_location = storage;
        }

    }
}
#pragma warning restore IDE1006 // Naming Styles



