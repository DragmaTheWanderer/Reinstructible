using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Reinstructible.Server.DL;
using Reinstructible.Server.HTTPRequest;
using Reinstructible.Server.Models;
using System.Collections.Generic;
using System.Text.Json;

namespace Reinstructible.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThemeController(IHttpClientFactory httpClientFactory, SqliteContext context) : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
        private readonly SqliteContext _context = context;
       
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

        public void SaveThemes(Theme[] themes)
        {
            foreach (var theme in themes)
            {
                //check if theme is saved
                Theme? themeCheck = GetSavedThemeByItem(theme);
                if (themeCheck == null) {
                    CreateSavedItem(theme);
                }
            }
        }

        //CRUD Methods
        public void CreateSavedItem(Theme theme)
        {
            DBModels.Theme dbTheme = new(theme);
            _context.Themes.Add(dbTheme);
            _context.SaveChanges();
        }
        public List<Theme> ReadSavedItems()
        {
            List<Theme> result = [];
            var dbThemes = _context.Themes.OrderBy(x => x.name).ToList();
            foreach (var item in dbThemes)
            {
                result.Add(new Theme(item));
            }
            return result;
        }
        public Theme? GetSavedThemeByItem(Theme theme)
        {
            Theme? result = null;
            var dbTheme = _context.Themes.Where(x => x.id == theme.id);
            if (!dbTheme.Any()) return result;

            result = new Theme(dbTheme.FirstOrDefault()!);
            return result;
        }
        public Theme? GetSavedThemeById(int id)
        {
            Theme? result = null;
            var dbTheme = _context.Themes.Where(x => x.id == id);
            if (!dbTheme.Any()) return result;

            result = new Theme(dbTheme.FirstOrDefault()!);
            return result;
        }
        public void UpdateSavedItem(Theme theme)
        {
            DBModels.Theme dbTheme = new(theme);
            _context.Themes.Update(dbTheme);
            _context.SaveChanges();
        }
        public void DeleteSavedItem(Theme theme)
        {
            DBModels.Theme dbTheme = new(theme);
            _context.Themes.Remove(dbTheme);
            _context.SaveChanges();
        }

    }
}
