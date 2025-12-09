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


        public Part() { }
        public Part(string? part_num, string? name, int part_cat_id, int year_from, int year_to)
        {
            this.part_num = part_num;
            this.name = name;
            this.part_cat_id = part_cat_id;
            this.year_from = year_from;
            this.year_to = year_to;
        }
        public Part(DBModels.Part dbm)
        {
            this.part_num = dbm.part_num;
            this.name = dbm.name;
            this.part_cat_id = dbm.part_cat_id;
            this.year_from = dbm.year_from;
            this.year_to = dbm.year_to;
        }
    }



}
#pragma warning restore IDE1006 // Naming Styles