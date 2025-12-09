    #pragma warning disable IDE1006 // Naming Styles
namespace Reinstructible.Server.Models
{
    public class External_Ids_Color
    {
        public Bricklink? BrickLink { get; set; }
        public Brickowl? BrickOwl { get; set; }
        public LEGO? LEGO { get; set; }
        public Peeron? Peeron { get; set; }
        public Ldraw? LDraw { get; set; }
    }

    public class External_Ids_Part
    {
        public string[]? BrickLink { get; set; }
        public string[]? BrickOwl { get; set; }
        public string[]? Brickset { get; set; }
        public string[]? LDraw { get; set; }
        public string[]? LEGO { get; set; }
        public string[]? Peeron { get; set; }
    }

    public class Bricklink
    {
        public int[]? ext_ids { get; set; }
        public string[][]? ext_descrs { get; set; }
    }

    public class Brickowl
    {
        public int[]? ext_ids { get; set; }
        public string[][]? ext_descrs { get; set; }
    }

    public class LEGO
    {
        public int[]? ext_ids { get; set; }
        public string[][]? ext_descrs { get; set; }
    }

    public class Peeron
    {
        public object[]? ext_ids { get; set; }
        public string[][]? ext_descrs { get; set; }
    }

    public class Ldraw
    {
        public int[]? ext_ids { get; set; }
        public string[][]? ext_descrs { get; set; }
    }

}
#pragma warning restore IDE1006 // Naming Styles