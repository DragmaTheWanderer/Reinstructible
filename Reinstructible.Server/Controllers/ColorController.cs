using Microsoft.AspNetCore.Mvc;
using Reinstructible.Server.HTTPRequest;
using Reinstructible.Server.Models;
using System.Text.Json;

namespace Reinstructible.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ColorController(IHttpClientFactory httpClientFactory) : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;

        [HttpGet]
        public async Task<Color[]> GetAsync(string id = "")
        {
            const string type = "colors";
            Color[]? result;
            var service = new RebrickableAPIService(_httpClientFactory);

            if (string.IsNullOrWhiteSpace(id))
            {
                var resultStr = await service.GetRecordsAsync(type);
                Colors? detail = JsonSerializer.Deserialize<Colors>(resultStr);
                result = detail!.results!;
            }
            else
            {
                var resultStr = await service.GetRecordByIdAsync(type, id);
                Color? detail = JsonSerializer.Deserialize<Color>(resultStr);
                result = [detail!];
            }
            return result;
        }
    }
}
