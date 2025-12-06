using Microsoft.AspNetCore.Mvc;
using Reinstructible.Server.DL;
using Reinstructible.Server.HTTPRequest;
using Reinstructible.Server.Models;
using System.Text.Json;

namespace Reinstructible.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PartCategoryController(IHttpClientFactory httpClientFactory, sqliteContext context) : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
        private readonly sqliteContext _context = context;

        [HttpGet]
        public async Task<PartCategory[]> GetAsync(string id = "")
        {
            const string type = "part_categories";
            PartCategory[]? result;
            var service = new RebrickableAPIService(_httpClientFactory);

            if (string.IsNullOrWhiteSpace(id))
            {
                var resultStr = await service.GetRecordsAsync(type);
                PartCategorys? detail = JsonSerializer.Deserialize<PartCategorys>(resultStr);
                result = detail!.results!;
            }
            else
            {
                var resultStr = await service.GetRecordByIdAsync(type, id);
                PartCategory? detail = JsonSerializer.Deserialize<PartCategory>(resultStr);
                result = [detail!];
            }
            return result;
        }
        //CRUD Methods
        public void CreateSavedItem(PartCategory partCategory)
        {
            _ = _context.PartCategorys.Add(partCategory);
        }
        public List<PartCategory> ReadSavedItems()
        {
            var result = _context.PartCategorys.OrderBy(x => x.name).ToList();

            return result;
        }
        public PartCategory GetSavedSetByItem(PartCategory partCategory)
        {
            var result = (PartCategory)_context.PartCategorys.Where(x => x.id == partCategory.id);


            return result;
        }
        public void UpdateSavedItem(PartCategory partCategory)
        {
            _ = _context.PartCategorys.Update(partCategory);
        }
        public void DeleteSavedItem(PartCategory partCategory)
        {
            _ = _context.PartCategorys.Remove(partCategory);
        }

    }
}
