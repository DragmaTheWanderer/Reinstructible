#pragma warning disable IDE1006 // Naming Styles

namespace Reinstructible.Server.Models
{
  
    public class LegoSets:BaseRecord
    {
        public LegoSet[]? results { get; set; }
    }

    public class LegoSet
    {
        public string? set_num { get; set; }
        public string? name { get; set; }
        public int year { get; set; }
        public int theme_id { get; set; }
        public Theme[]? theme { get;set; }
        public int num_parts { get; set; }
        public string? set_img_url { get; set; }
        public string? set_url { get; set; }
        public DateTime? last_modified_dt { get; set; }

        public LegoSet() { }
        public LegoSet(string? set_num, string? name, int year, int theme_id, int num_parts, string? set_img_url, string? set_url)
        {
            this.set_num = set_num;
            this.name = name;
            this.year = year;
            this.theme_id = theme_id;
            this.num_parts = num_parts;
            this.set_img_url = set_img_url;
            this.set_url = set_url;
        }
        public LegoSet(DBModels.LegoSet dbm)
        {
            this.set_num = dbm.set_num;
            this.name = dbm.name;
            this.year = dbm.year;
            this.theme_id = dbm.theme_id;
            this.num_parts = dbm.num_parts;
            this.set_img_url = dbm.set_img_url;
            this.set_url = dbm.set_url;
        }
        public LegoSet(DBModels.LegoSet dbm, Theme[] theme )
        {
            this.set_num = dbm.set_num;
            this.name = dbm.name;
            this.year = dbm.year;
            this.theme_id = dbm.theme_id;
            this.theme = theme;
            this.num_parts = dbm.num_parts;
            this.set_img_url = dbm.set_img_url;
            this.set_url = dbm.set_url;
        }

    }

}
#pragma warning restore IDE1006 // Naming Styles