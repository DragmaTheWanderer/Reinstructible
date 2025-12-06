using Microsoft.AspNetCore.Mvc;
using Reinstructible.Server.DL;
using Reinstructible.Server.HTTPRequest;
using Reinstructible.Server.Models;
using System.Text.Json;

namespace Reinstructible.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThemeController(IHttpClientFactory httpClientFactory, sqliteContext context) : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
        private readonly sqliteContext _context = context;

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

        //CRUD Methods
        public void CreateSavedItem(Theme theme)
        {
            _ = _context.Themes.Add(theme);
        }
        public List<Theme> ReadSavedItems()
        {
            var result = _context.Themes.OrderBy(x => x.name).ToList();

            return result;
        }
        public Theme GetSavedSetByItem(Theme theme)
        {
            var result = (Theme)_context.Themes.Where(x => x.id == theme.id);


            return result;
        }
        public void UpdateSavedItem(Theme theme)
        {
            _ = _context.Themes.Update(theme);
        }
        public void DeleteSavedItem(Theme theme)
        {
            _ = _context.Themes.Remove(theme);
        }

    }
}
