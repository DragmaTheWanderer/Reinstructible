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

        public async Task SaveParts(Part[] parts)
        {
            //Check each part to see if it has been saved
            foreach (var part in parts) {
                Part? testPart = GetSavedPartByItem(part);
                if (testPart == null) {
                    //no part saved, We have the Part so save it
                    CreateSavedItem(part);
                }
            }
        }
        //CRUD Methods
        public void CreateSavedItem(Part part)
        {
            DBModels.Part dbPart = new(part);
            _context.Parts.Add(dbPart);
            _context.SaveChanges();
        }
        public List<Part> ReadSavedItems()
        {
            List<Part> result = [];
            var dbPart = _context.Parts.OrderBy(x => x.name).ToList();

            foreach (var item in dbPart) {
                result.Add(new Part(item));
            }

            return result;
        }
        public Part? GetSavedPartByItem(Part part)
        {
            Part? result = null;
            var dbPart = _context.Parts.Where(x => x.part_num == part.part_num);

            if (!dbPart.Any()) return result;

            result = new Part(dbPart.FirstOrDefault()!);
            return result;
        }
        public Part? GetSavedPartById(string part_num)
        {
            Part? result = null;
            var dbPart = _context.Parts.Where(x => x.part_num == part_num);

            if (!dbPart.Any()) return result;

            result = new Part(dbPart.FirstOrDefault()!);
            return result;
        }
        public void UpdateSavedItem(Part part)
        {
            DBModels.Part dbPart = new(part);
            _context.Parts.Update(dbPart);
            _context.SaveChanges();
        }
        public void DeleteSavedItem(Part part)
        {
            DBModels.Part dbPart = new(part);
            _context.Parts.Remove(dbPart);
            _context.SaveChanges();
        }

    }
}
