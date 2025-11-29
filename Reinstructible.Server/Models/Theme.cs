#pragma warning disable IDE1006 // Naming Styles
namespace Reinstructible.Server.Models
{
    public class Themes : BaseRecord
    {
        public Theme[]? results { get; set; }
    }
    public class Theme
    {
        public int id { get; set; }
        public object? parent_id { get; set; }
        public string? name { get; set; }
    }

}
#pragma warning restore IDE1006 // Naming Styles