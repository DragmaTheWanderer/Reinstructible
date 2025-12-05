namespace Reinstructible.Server.Models
{
    public class SubInventory
    {
        //Key combo
        public int id {  get; set; }
        public string? set_num { get; set; }
        public string? element_id { get; set; }

        //fields
        public int quantity { get; set; }
        public string subBuildName { get; set; }
        public int page { get; set; }
        public int step { get; set; }
    }
}
