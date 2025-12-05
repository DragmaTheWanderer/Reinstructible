using System.ComponentModel.DataAnnotations;

namespace Reinstructible.Server.Models
{
    public class Storage
    {
        [Key]
        public int Id { get; set; }
        public string? element_id { get; set; }
        public string? Bin { get; set; }
        public string? Drawer { get; set; }

        public override string ToString()
        {
            return string.Format("[Storage: ID={0}, Bin={1}, Drawer={2}]", Id, Bin, Drawer);
        }

        public Storage() { }

    }
}
