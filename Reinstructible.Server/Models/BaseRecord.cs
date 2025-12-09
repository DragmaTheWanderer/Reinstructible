#pragma warning disable IDE1006 // Naming Styles
namespace Reinstructible.Server.Models
{
    public class BaseRecord
    {
        public int count { get; set; }
        public object? next { get; set; }
        public object? previous { get; set; }
    }
}
#pragma warning restore IDE1006 // Naming Styles
