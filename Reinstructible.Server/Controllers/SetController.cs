using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing.Constraints;
using Reinstructible.Server.DL;
using Reinstructible.Server.HTTPRequest;
using Reinstructible.Server.Models;
using System.Text.Json;

namespace Reinstructible.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SetController(IHttpClientFactory httpClientFactory, SqliteContext context) : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
        private readonly SqliteContext _context = context;

        private readonly ThemeController _themeController = new(httpClientFactory, context);
        private readonly ElementController _elementController = new(httpClientFactory, context);

        [HttpGet]
        public async Task<LegoSet[]> GetAsync(string filter="", string id ="", string param = "")
        {
            const string typeSet = "sets";
            const string typeTheme = "themes";
            LegoSet[]? result;
            var service = new RebrickableAPIService(_httpClientFactory);

            if (string.IsNullOrWhiteSpace(id))
            {
                var resultStr = await service.GetRecordsAsync(typeSet, filter);
                LegoSets? detail = JsonSerializer.Deserialize<LegoSets>(resultStr);
                result = detail!.results!;
            }
            else
            {
                var resultStr = string.IsNullOrEmpty(param) ?
                    await service.GetRecordByIdAsync(typeSet, id) :
                    await service.GetRecordByIdAsync(typeSet, id, param);
                
                LegoSet? setDetail = JsonSerializer.Deserialize<LegoSet>(resultStr);
                result = [setDetail!];
            }


            //get the set theme
            foreach(var item in result)
            {
                var resultStr = await service.GetRecordByIdAsync(typeTheme, item.theme_id.ToString());
                Theme themeItem = JsonSerializer.Deserialize<Theme>(resultStr)!;
                List<Theme>? themeDetail = [themeItem];
                while (themeItem.parent_id != null) {
                    resultStr = await service.GetRecordByIdAsync(typeTheme, themeItem.parent_id.ToString()!);
                    themeItem = JsonSerializer.Deserialize<Theme>(resultStr)!;
                    themeDetail.Add(themeItem);
                }
                item.theme = [.. themeDetail];
            }
            
            return result;
        }

        [HttpPost]
        public async Task<string> PostAsync([FromBody] string data)
        {
            Console.WriteLine("acheaved post from sets controller");
            //checked if set is in DB
            LegoSet? legoSet = GetSavedSetBySetNum(data);
            if (legoSet == null)
            {
                //no set saved,  Save Themes first
                //reload the set from Reinstructible
                LegoSet[] lsArray = await GetAsync(id: data);
                foreach (var ls in lsArray)
                {
                    _themeController.SaveThemes(ls.theme!);
                    //save the set
                    CreateSavedItem(ls);
                    //save the elements
                    //_elementController.SaveElements(ls.set_num);
                }
            }
            return data;
        }

       
        //CRUD Methods
        public void CreateSavedItem(LegoSet set)
        {
            set.theme = null;
            _context.LegoSets.Add(set);
            _context.SaveChanges();
        }
        public List<LegoSet> ReadSavedItems()
        {
            var result = _context.LegoSets.OrderBy(x=>x.name).ToList();

            return result;
        }
        public LegoSet GetSavedSetByItem(LegoSet set)
        {
            var result = (LegoSet)_context.LegoSets.Where(x=>x.set_num == set.set_num);
                

            return result;
        }
        public LegoSet? GetSavedSetBySetNum(string setNum)
        {
            LegoSet? result = null;
            var test = _context.LegoSets.Where(x => x.set_num == setNum);

            if (!test.Any()) return result;

            result = test.FirstOrDefault()!;
            return result;
        }
        public void UpdateSavedItem(LegoSet set)
        {
            _context.LegoSets.Update(set);
            _context.SaveChanges();
        }
        public void DeleteSavedItem(LegoSet set)
        {
            _context.LegoSets.Remove(set);
            _context.SaveChanges();
        }
    }
}
