using Microsoft.AspNetCore.Mvc;
using Reinstructible.Server.DL;
using Reinstructible.Server.HTTPRequest;
using Reinstructible.Server.Models;
using System.Text.Json;

namespace Reinstructible.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ElementController(IHttpClientFactory httpClientFactory, sqliteContext context) : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
        private readonly sqliteContext _context = context;

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

        //CRUD Methods
        public void CreateSavedItem(Element element)
        {
            _ = _context.Elements.Add(element);
        }
        public List<Element> ReadSavedItems()
        {
            var result = _context.Elements.OrderBy(x => x.part!.name).ThenBy(y=>y.color!.name).ToList();

            return result;
        }
        public Element GetSavedItemByItem(Element element)
        {
            var result = (Element)_context.Elements.Where(x => x.element_id == element.element_id);


            return result;
        }
        public void UpdateSavedItem(Element element)
        {
            _ = _context.Elements.Update(element);
        }
        public void DeleteSavedItem(Element element)
        {
            _ = _context.Elements.Remove(element);
        }

    }
}


