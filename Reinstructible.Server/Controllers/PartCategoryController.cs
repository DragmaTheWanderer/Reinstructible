using Microsoft.AspNetCore.Mvc;
using Reinstructible.Server.DL;
using Reinstructible.Server.HTTPRequest;
using Reinstructible.Server.Models;
using System.Text.Json;
using System.Threading.Tasks;

namespace Reinstructible.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PartCategoryController(IHttpClientFactory httpClientFactory, SqliteContext context) : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
        private readonly SqliteContext _context = context;

        [HttpGet]
        public async Task<PartCategory[]> GetAsync(string id = "")
        {
            const string type = "part_categories";
            PartCategory[]? result;
            var service = new RebrickableAPIService(_httpClientFactory);
            //check to see if the category is in the DB first
            var dbCategory = await GetSavedCategoryByID(int.TryParse(id, out var parsedId) ? parsedId : 0);
            if (dbCategory != null)
            {
                result = [dbCategory];
            }
            else
            {

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
            }
            return result;
        }

        public async Task SaveCategories(int[] Ids)
        {
            //check each ID to see if we have a category
            foreach (var id in Ids) {
                PartCategory? partCategory = await GetSavedCategoryByID(id);
                if (partCategory == null) {
                    //no category saved,  get from Rebrickable API
                    PartCategory[] partCategories = await GetAsync(id.ToString());
                    foreach (var category in partCategories) {
                        CreateSavedItem(category);
                    }
                }
            }

        }
        //CRUD Methods
        public void CreateSavedItem(PartCategory partCategory)
        {
            DBModels.PartCategory dbPartCategory = new(partCategory);
            _context.PartCategorys.Add(dbPartCategory);
            _context.SaveChanges();
        }
        public List<PartCategory> ReadSavedItems()
        {
            List<PartCategory> result = [];
            var dbPartCategory =_context.PartCategorys.OrderBy(x => x.name).ToList();
            foreach (var item in dbPartCategory)
            {
                result.Add(new PartCategory(item));
            }

            return result;
        }
        public async Task<PartCategory?> GetSavedCategoryByID(int Id)
        {
            PartCategory? result = null;
            var dbPartCategory = _context.PartCategorys.Where(x => x.id == Id);

            if (!dbPartCategory.Any()) return result;

            result = new PartCategory(dbPartCategory.FirstOrDefault()!);
            return result;
        }
        public void UpdateSavedItem(PartCategory partCategory)
        {
            DBModels.PartCategory dbPartCategory = new(partCategory);
            _ = _context.PartCategorys.Update(dbPartCategory);
            _context.SaveChanges();
        }
        public void DeleteSavedItem(PartCategory partCategory)
        {
            DBModels.PartCategory dbPartCategory = new(partCategory);
            _ = _context.PartCategorys.Remove(dbPartCategory);
            _context.SaveChanges();
        }

    }
}
