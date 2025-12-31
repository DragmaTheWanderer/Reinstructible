#pragma warning disable IDE1006 // Naming Styles

namespace Reinstructible.Server.Models
{
    public class Storage
    {
        public string? element_id { get; set; }
        public string? bin { get; set; }
        public string? drawer { get; set; }

       
        public Storage() { }
        public Storage(string? element_id) {
            this.element_id = element_id;
            this.bin = "Unassigned";
            this.drawer = "Unassigned";
        }
        public Storage(string? element_id, string? bin, string? drawer)
        {
            this.element_id = element_id;
            this.bin = bin;
            this.drawer = drawer;
        }
        public Storage(DBModels.Storage dbm)
        {
            this.element_id = dbm.element_id;
            this.bin = dbm.bin;
            this.drawer = dbm.drawer;
        }
    }

    public class StorageAll
    {
        public string[]? element_ids { get; set; }
        public string? bin { get; set; }
        public string? drawer { get; set; }


        public StorageAll() { }
       
        public StorageAll(string[]? element_ids, string? bin, string? drawer)
        {
            this.element_ids = element_ids;
            this.bin = bin;
            this.drawer = drawer;
        }
    }

}
#pragma warning restore IDE1006 // Naming Styles