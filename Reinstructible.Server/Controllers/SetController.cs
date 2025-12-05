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
    public class SetController(IHttpClientFactory httpClientFactory, sqliteContext context) : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
        private readonly sqliteContext _context = context;

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
                item.theme = themeDetail.ToArray();
            }
            
            return result;
        }

        //CRUD Methods
        public void CreateSavedSet(LegoSet set)
        {
            var result = _context.LegoSets.Add(set);
        }
        public List<LegoSet> ReadSavedSets()
        {
            var result = _context.LegoSets.OrderBy(x=>x.name).ToList();

            return result;
        }
        public LegoSet GetSavedSetBySet(LegoSet set)
        {
            var result = (LegoSet)_context.LegoSets.Where(x=>x.set_num == set.set_num);
                

            return result;
        }
        public void UpdateSavedSet(LegoSet set)
        {
            var result = _context.LegoSets.Update(set);
        }
        public void DeleteSavedSet(LegoSet set)
        {
            var result = _context.LegoSets.Remove(set);
        }
    }
}
