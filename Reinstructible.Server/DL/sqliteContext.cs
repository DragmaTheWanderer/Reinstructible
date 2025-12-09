using Microsoft.EntityFrameworkCore;
using Reinstructible.Server.DBModels;
using System.Collections.Generic;

namespace Reinstructible.Server.DL
{
    public class SqliteContext(DbContextOptions<SqliteContext> options) : DbContext(options)
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Configure the context to use SQLite and a local database file
            optionsBuilder.UseSqlite("Data Source=reinstructiable.db");
        }
        public DbSet<Color> Colors { get; set; }
        public DbSet<Element> Elements { get; set; }
        public DbSet<LegoSet> LegoSets { get; set; }
        public DbSet<Part> Parts { get; set; }
        public DbSet<PartCategory> PartCategorys { get; set; }
        public DbSet<Storage> Storages { get; set; }
        public DbSet<SubInventory> SubInventories { get; set; }
        public DbSet<Theme> Themes { get; set; }

        //in the package manager console
        //use Add-Migration InitialCreate to create the DB
        // undo with Remove-Migration
        // finally create the file with: Update-Database

    }
}
