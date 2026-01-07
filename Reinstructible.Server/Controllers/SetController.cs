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

        const string typeSet = "sets";
        const string typeTheme = "themes";

        [HttpGet]
        public async Task<LegoSet[]> GetAsync(string filter="", string id ="", string param = "")
        {
            LegoSet[]? result = param switch
            {
                "AddSets" => await GetSetFromAPI(filter, id, param),
                _ => await GetSetsFromDB(),
            };
            return result;
        }

        private async Task<LegoSet[]> GetSetFromAPI(string filter, string id, string param)
        {
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
            foreach (var item in result)
            {
                var resultStr = await service.GetRecordByIdAsync(typeTheme, item.theme_id.ToString());
                Theme themeItem = JsonSerializer.Deserialize<Theme>(resultStr)!;
                List<Theme>? themeDetail = [themeItem];
                while (themeItem.parent_id != null)
                {
                    resultStr = await service.GetRecordByIdAsync(typeTheme, themeItem.parent_id.ToString()!);
                    themeItem = JsonSerializer.Deserialize<Theme>(resultStr)!;
                    themeDetail.Add(themeItem);
                }
                item.theme = [.. themeDetail];
            }

            return result;
        }
        private async Task<LegoSet[]> GetSetsFromDB()
        {
            //load saved sets
            LegoSet[]? result;
            List<LegoSet> setDB = ReadSavedItems();
                
            foreach(var set in setDB)
            {
                var theme = _themeController.GetSavedThemeById(set.theme_id);
                List<Theme> themeList = [];
                themeList.Add(theme!);

                set.theme = [.. themeList];
            }
            result = [.. setDB.OrderBy(x => x.theme![0].name).ThenBy(x => x.name)];
            return result;
        }

        [HttpPost]
        public async Task<IActionResult> PostAsync([FromBody] string set_num)
        {
            Console.WriteLine("acheaved post from sets controller");
            //checked if set is in DB
            LegoSet? legoSet = GetSavedSetBySetNum(set_num);
            //allow for resaving of set info if needed.
            
            //if (legoSet == null)
            //{
                //no set saved,  Save Themes first
                //reload the set from Reinstructible
                LegoSet[] lsArray = await GetSetFromAPI("", set_num, "");
                foreach (var ls in lsArray)
                {
                    _themeController.SaveThemes(ls.theme!);
                    //save the set
                    await CreateSavedItem(ls);
                    //save the elements
                    await _elementController.SaveElements(ls.set_num!);
                }
            //}
            string result = $"Received: {set_num} at {System.DateTime.Now}";
            string jsonresult = JsonSerializer.Serialize(result);
            return Ok(jsonresult);
        }


       
        //CRUD Methods
        public async Task CreateSavedItem(LegoSet set)
        {
            LegoSet? legoSet = GetSavedSetBySetNum(set.set_num!);
            ;
            if (legoSet != null)
            {
                Console.WriteLine($"Set {set.set_num} already exists in DB, skipping save.");
                UpdateSavedItem(set);
                return;
            }
            DBModels.LegoSet dbSet = new(set);
            _context.LegoSets.Add(dbSet);
            _context.SaveChanges();
        }
        public List<LegoSet> ReadSavedItems()
        {
            List<LegoSet> result = [];
            var dbSet = _context.LegoSets.ToList();
            foreach (var item in dbSet) {
                result.Add(new LegoSet(item));
            }
            return result;
        }
        public LegoSet GetSavedSetByItem(LegoSet set)
        {
            var dbSet = _context.LegoSets.Where(x=>x.set_num == set.set_num).FirstOrDefault();
            LegoSet result = new(dbSet!);
            return result;
        }
        public LegoSet? GetSavedSetBySetNum(string setNum)
        {
            LegoSet? result = null;
            var test = _context.LegoSets.Where(x => x.set_num == setNum);

            if (!test.Any()) return result;

            result = new LegoSet(test.FirstOrDefault()!);
            return result;
        }
        public void UpdateSavedItem(LegoSet set)
        {
            DBModels.LegoSet dbSet = _context.LegoSets.Where(x => x.set_num == set.set_num).FirstOrDefault();
            dbSet.updateFromModel(set);
            _context.LegoSets.Update(dbSet);
            _context.SaveChanges();
        }
        public void DeleteSavedItem(LegoSet set)
        {
            DBModels.LegoSet dbSet = new(set);
            _context.LegoSets.Remove(dbSet);
            _context.SaveChanges();
        }
    }
}
