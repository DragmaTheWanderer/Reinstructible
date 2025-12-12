#pragma warning disable IDE1006 // Naming Styles
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Reinstructible.Server.DBModels
{
  
    public class Theme
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int id { get; set; }
        public int? parent_id { get; set; }
        public string? name { get; set; }

        public Theme() { }
        public Theme(int id, string name, int? parent_id = null)
        {
            this.id = id;
            this.parent_id = parent_id;
            this.name = name;
        }
        public Theme(Models.Theme vm)
        {
            this.id = vm.id;
            this.parent_id=vm.parent_id;
            this.name = vm.name;
        }
    }

}
#pragma warning restore IDE1006 // Naming Styles