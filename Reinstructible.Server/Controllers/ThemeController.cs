using Microsoft.AspNetCore.Mvc;
using Reinstructible.Server.HTTPRequest;
using Reinstructible.Server.Models;
using System.Text.Json;

namespace Reinstructible.Server.Controllers
{
    public class ThemeController(IHttpClientFactory httpClientFactory) : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;

        [HttpGet]
        public async Task<Theme[]> GetAsync(string id = "")
        {
            const string type = "part_categories";
            Theme[]? result;
            var service = new RebrickableAPIService(_httpClientFactory);

            if (string.IsNullOrWhiteSpace(id))
            {
                var resultStr = await service.GetRecordsAsync(type);
                Themes? detail = JsonSerializer.Deserialize<Themes>(resultStr);
                result = detail!.results!;
            }
            else
            {
                var resultStr = await service.GetRecordByIdAsync(type, id);
                Theme? detail = JsonSerializer.Deserialize<Theme>(resultStr);
                result = [detail!];
            }
            return result;
        }
    }
}
