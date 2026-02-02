using Microsoft.AspNetCore.Mvc;
using Reinstructible.Server.DL;
using Reinstructible.Server.HTTPRequest;
using Reinstructible.Server.Models;
using System.IO;
using System.Text.Json;

namespace Reinstructible.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ColorController(IHttpClientFactory httpClientFactory, SqliteContext context) : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
        private readonly SqliteContext _context = context;

        [HttpGet]
        public async Task<Color[]> GetAsync(string id = "")
        {
            const string type = "colors";
            Color[]? result;
            var service = new RebrickableAPIService(_httpClientFactory);
            //check to see if the category is in the DB first
            var dbColor = await GetColorByIdFromDB(id);
            if (dbColor != null)
            {
                result = [dbColor];
            }
            else
            {
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
            }
            return result;
        }

        private async Task<Color?> GetColorByIdFromDB(string id)
        {
            Color? result = GetSavedColorById(int.Parse(id));
            return result;
        }
        public async Task SaveColors(Color[] colors)
        {
            //Check each color to see if it has been saved
            foreach (var color in colors)
            {
                Color? testcolor = GetSavedColorByItem(color);
                if (testcolor == null)
                {
                    //no color saved, We have the color so save it
                    CreateSavedItem(color);
                }
            }
        }
        //CRUD Methods
        public void CreateSavedItem(Color color)
        {
            DBModels.Color dbColor = new(color);
            _context.Colors.Add(dbColor);
            _context.SaveChanges();
        }
        public List<Color> ReadSavedItems()
        {
            List<Color> result = [];
            var dbColor = _context.Colors.OrderBy(x => x.name).ToList();
            foreach (var item in dbColor)
            {
                result.Add(new Color(item));
            }

            return result;
        }
        public Color? GetSavedColorByItem(Color color)
        {
            Color? result = null;
            var dbColor = _context.Colors.Where(x => x.id == color.id);

            if (!dbColor.Any()) return result;

            result = new Color(dbColor.FirstOrDefault()!);
            return result;
        }

        public Color? GetSavedColorById(int color_id)
        {
            Color? result = null;
            var dbColor = _context.Colors.Where(x => x.id == color_id);

            if (!dbColor.Any()) return result;

            result = new Color(dbColor.FirstOrDefault()!);
            return result;
        }

        public void UpdateSavedItem(Color color)
        {
            DBModels.Color dbColor = new(color);
            _context.Colors.Update(dbColor);
            _context.SaveChanges();
        }
        public void DeleteSavedItem(Color color)
        {
            DBModels.Color dbColor = new(color);
            _context.Colors.Remove(dbColor);
            _context.SaveChanges();
        }

    }
}
