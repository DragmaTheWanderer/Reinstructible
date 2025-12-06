using Microsoft.AspNetCore.Mvc;
using Reinstructible.Server.DL;
using Reinstructible.Server.HTTPRequest;
using Reinstructible.Server.Models;
using System.Text.Json;

namespace Reinstructible.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ColorController(IHttpClientFactory httpClientFactory, sqliteContext context) : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
        private readonly sqliteContext _context = context;

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

        //CRUD Methods
        public void CreateSavedItem(Color solor)
        {
            _ = _context.Colors.Add(solor);
        }
        public List<Color> ReadSavedItems()
        {
            var result = _context.Colors.OrderBy(x => x.name).ToList();

            return result;
        }
        public Color GetSavedSetByItem(Color color)
        {
            var result = (Color)_context.Colors.Where(x => x.id == color.id);


            return result;
        }
        public void UpdateSavedItem(Color color)
        {
            _ = _context.Colors.Update(color);
        }
        public void DeleteSavedItem(Color color)
        {
            _ = _context.Colors.Remove(color);
        }

    }
}
