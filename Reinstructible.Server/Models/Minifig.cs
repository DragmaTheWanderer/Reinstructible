namespace Reinstructible.Server.Models
{
    public class Minifigs : BaseRecord
    {
        public Minifig[]? results { get; set; }
    }


    public class Minifig
    {

        public int id { get; set; }
        public string set_num { get; set; }
        public string set_name { get; set; }
        public int quantity { get; set; }
        public string set_img_url { get; set; }

        public Minifig() { }

    }
}
