using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Infrastructure.Internal;
using Reinstructible.Server.DL;
using Reinstructible.Server.Models;
using System.Text.Json;

namespace Reinstructible.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StorageController(IHttpClientFactory httpClientFactory, SqliteContext context) : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
        private readonly SqliteContext _context = context;

        [HttpGet]
        public async Task<Storage[]> GetAsync()
        {
            return null;
        }

        [HttpPost]
        public async Task<IActionResult> PostAsync([FromBody] JsonElement storageItem)
        {
            //deserilaze the storage item
            //var storage = JsonSerializer.Deserialize<Storage>(storageItem);
            // if the element Id is null then it is an all
            List<StorageAll> storageAll = JsonSerializer.Deserialize<List<StorageAll>>(storageItem)!;
            foreach (var storage in storageAll)
            {

                //if (storage.element_ids != null)
                //{
                //    await upsertStorage(storage);
                //}
                //else
                //{
                    foreach (var id in storage!.element_ids!)
                    {
                        var store = new Storage(id, storage.bin, storage.drawer);
                        await upsertStorage(store);
                    }
                //}
            }
            return Ok(storageItem);

            async Task upsertStorage(Storage storage)
            {
                //check if item exsists, if not create it, if so update it
                var test = CheckStorageByElementID(storage!.element_id!);
                if (test != null)
                { UpdateSavedItem(storage); }
                else
                { await CreateSavedItem(storage); }

                string result = $"Received: {storage!.element_id} at {System.DateTime.Now}";
                string jsonresult = JsonSerializer.Serialize(result);
            }
        }

        //crud operations

        public async Task CreateSavedItem(Storage Storage)
        {
            DBModels.Storage dbStorage = new(Storage);

            var test = _context.Storages.Where(x => x.element_id == dbStorage.element_id);
            if (!test.Any())
            {
                _context.Storages.Add(dbStorage);
                _context.SaveChanges();
            }
        }

        public Storage? GetStorageByElementID(string elementID)
        {
            Storage result = new(elementID);
            var storageDB = _context.Storages.Where(x => x.element_id == elementID);

            if (storageDB.Any()) {
                result = new(storageDB.FirstOrDefault()!);
            }

            return result;
        }
        public Storage? CheckStorageByElementID(string elementID)
        {
            Storage? result = null;
            var storageDB = _context.Storages.Where(x => x.element_id == elementID);

            if (storageDB.Any())
            {
                result = new(storageDB.FirstOrDefault()!);
            }

            return result;
        }


        public void UpdateSavedItem(Storage Storage)
        {
            //DBModels.Storage dbStorage = new(Storage);
            var trackedStorage = _context.Storages.Find(Storage.element_id);
            trackedStorage.bin = Storage.bin;
            trackedStorage.drawer = Storage.drawer;
            _context.SaveChanges();
        }
        public void DeleteSavedItem(Storage Storage)
        {
            DBModels.Storage dbStorage = new(Storage);
            _context.Storages.Remove(dbStorage);
            _context.SaveChanges();
        }
    }
}
