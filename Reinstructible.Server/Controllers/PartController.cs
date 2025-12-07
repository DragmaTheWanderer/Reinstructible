using Microsoft.AspNetCore.Mvc;
using Reinstructible.Server.DL;
using Reinstructible.Server.HTTPRequest;
using Reinstructible.Server.Models;
using System.Text.Json;

namespace Reinstructible.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PartController(IHttpClientFactory httpClientFactory, SqliteContext context) : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
        private readonly SqliteContext _context = context;

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

        //CRUD Methods
        public void CreateSavedItem(Part part)
        {
            _ = _context.Parts.Add(part);
        }
        public List<Part> ReadSavedItems()
        {
            var result = _context.Parts.OrderBy(x => x.name).ToList();

            return result;
        }
        public Part GetSavedSetByItem(Part part)
        {
            var result = (Part)_context.Parts.Where(x => x.part_num == part.part_num);


            return result;
        }
        public void UpdateSavedItem(Part part)
        {
            _ = _context.Parts.Update(part);
        }
        public void DeleteSavedItem(Part part)
        {
            _ = _context.Parts.Remove(part);
        }

    }
}
