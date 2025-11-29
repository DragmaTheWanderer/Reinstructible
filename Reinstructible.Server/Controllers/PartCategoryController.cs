using Microsoft.AspNetCore.Mvc;
using Reinstructible.Server.HTTPRequest;
using Reinstructible.Server.Models;
using System.Text.Json;

namespace Reinstructible.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PartCategoryController(IHttpClientFactory httpClientFactory) : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;

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
    }
}
