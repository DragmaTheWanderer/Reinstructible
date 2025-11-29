using Microsoft.AspNetCore.Mvc;
using Reinstructible.Server.HTTPRequest;
using Reinstructible.Server.Models;
using System.Linq;
using System.Net.Http;
using System.Text.Json;

namespace Reinstructible.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ElementController(IHttpClientFactory httpClientFactory) : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;

        [HttpGet]
        public async Task<Element[]> GetAsync(string id = "")
        {
            const string type = "sets";
            const string param = "parts";
            Element[]? result;
            var service = new RebrickableAPIService(_httpClientFactory);

            //get parts
            var resultStr = await service.GetRecordByIdAsync(type, id, param);
            Elements? detail = JsonSerializer.Deserialize<Elements>(resultStr);
            result = detail!.results;
                
            while (detail.next != null)
            {
                if (!string.IsNullOrWhiteSpace(detail.next.ToString()))
                {
                    resultStr = await service.GetRecordByURLAsync(detail.next.ToString()!);
                    detail = JsonSerializer.Deserialize<Elements>(resultStr);
                    var newResults = detail!.results;
                    result = ConcatElements([.. result!], [.. newResults!]);
                }
            }
            return result!;
        }
        private static Element[] ConcatElements(List<Element> OrigList, List<Element> NewList)
        {
            OrigList.AddRange(NewList);
            return [.. OrigList];
        }
    } 
}


