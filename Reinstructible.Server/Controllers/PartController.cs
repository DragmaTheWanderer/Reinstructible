using Microsoft.AspNetCore.Mvc;
using Reinstructible.Server.HTTPRequest;
using Reinstructible.Server.Models;
using System.Text.Json;

namespace Reinstructible.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PartController(IHttpClientFactory httpClientFactory) : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;

        [HttpGet]
        public async Task<Part[]> GetAsync(string id = "", string param = "")
        {
            string type = string.IsNullOrEmpty(param)? "parts" : "sets" ;
            Part[]? result;
            var service = new RebrickableAPIService(_httpClientFactory);

            if (string.IsNullOrWhiteSpace(id))
            {
                var resultStr = await service.GetRecordsAsync(type);
                Parts? detail = JsonSerializer.Deserialize<Parts>(resultStr);
                result = detail!.results!;
            }
            else
            {
                var resultStr = string.IsNullOrEmpty(param) ?
                    await service.GetRecordByIdAsync(type, id): 
                    await service.GetRecordByIdAsync(type, id, param);
                Part? detail = JsonSerializer.Deserialize<Part>(resultStr);
                result = [detail!];
            }
            return result;
        }
    }
}
