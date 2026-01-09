using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Reinstructible.Server.DL;
using Reinstructible.Server.Models;
using System;
using System.Net.Http;

namespace Reinstructible.Server.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class InventoryController(IHttpClientFactory httpClientFactory, SqliteContext context) : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
        private readonly SqliteContext _context = context;
        [HttpGet]
        public TestString Get()
        {
            var result = new TestString { Value = "this is a test" };

            return result;
        }

        //CRUD Methods
        public async Task CreateSavedItem(Element element)
        {
            var recordCheck = _context.Inventory.Where(x => x.set_num == element.set_num && x.element_id == element.element_id);
            if (recordCheck.Any())
            {
                DBModels.Inventory dbInventory = recordCheck.FirstOrDefault()!;
                dbInventory!.update(element);
                _context.Inventory.Update(dbInventory);
            }
            else
            {
                DBModels.Inventory dbInventory = new(element);
                _context.Inventory.Add(dbInventory);
            }
            _context.SaveChanges();
        }
        public List<Element> ReadSavedItems()
        {
            List<Element> result = [];
            var dbElement = _context.Inventory.OrderBy(x => x.set_num).ThenBy(x=>x.element_id).ToList();
            foreach (var item in dbElement)
            {
                result.Add(new Element(item));
            }
            return result;
        }
        public Element[]? GetSavedInventorysBySetNum(string setNum)
        {
            List<Element> result = [];
            var inventoryDB = _context.Inventory.Where(x => x.set_num == setNum);

            if (!inventoryDB.Any()) return null;

            foreach(var item in inventoryDB)
            {
                result.Add(new Element(item));
            }
            
            return [.. result];
        }
        public DBModels.Inventory[]? GetSavedInventorysByElementId(string element_Id)
        {
            List<DBModels.Inventory> result = [];
            var inventoryDB = _context.Inventory.Where(x => x.element_id == element_Id);

            if (!inventoryDB.Any()) return null;

            return [.. result];
        }
        public void UpdateSavedItem(Element element)
        {
            DBModels.Inventory dbInventory = new(element);
            _context.Inventory.Update(dbInventory);
            _context.SaveChanges();
        }
        public void DeleteSavedItem(Element element)
        {
            DBModels.Inventory dbInventory = new(element);
            _context.Inventory.Remove(dbInventory);
            _context.SaveChanges();
        }
    }
}
