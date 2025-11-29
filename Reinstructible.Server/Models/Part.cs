#pragma warning disable IDE1006 // Naming Styles
namespace Reinstructible.Server.Models
{
    public class Parts : BaseRecord
    {
        public Part[]? results { get; set; }
    }

    public class Part
    {
        public string?  part_num    { get; set; }
        public string?  name        { get; set; }
        public int      part_cat_id { get; set; }
        public int      year_from   { get; set; }
        public int      year_to     { get; set; }
        public string?  part_url    { get; set; }
        public string?  part_img_url { get; set; }
        public string[]? prints     { get; set; }
        public string[]? molds      { get; set; }
        public string[]? alternates { get; set; }
        public External_Ids_Part? external_ids { get; set; }
        public object?      print_of { get; set; }
    }



}
#pragma warning restore IDE1006 // Naming Styles