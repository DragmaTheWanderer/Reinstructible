#pragma warning disable IDE1006 // Naming Styles
using System.ComponentModel.DataAnnotations;

namespace Reinstructible.Server.Models
{
  
    public class LegoSets:BaseRecord
    {
        public LegoSet[]? results { get; set; }
    }

    public class LegoSet
    {
        [Key]
        public string? set_num { get; set; }
        public string? name { get; set; }
        public int year { get; set; }
        public int theme_id { get; set; }
        public Theme[]? theme { get;set; }
        public int num_parts { get; set; }
        public string? set_img_url { get; set; }
        public string? set_url { get; set; }
        public DateTime? last_modified_dt { get; set; }
    }

}
#pragma warning restore IDE1006 // Naming Styles