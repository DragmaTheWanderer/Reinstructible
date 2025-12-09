using Microsoft.AspNetCore.Mvc;
using Reinstructible.Server.DL;
using Reinstructible.Server.HTTPRequest;
using Reinstructible.Server.Models;
using System.Text.Json;

namespace Reinstructible.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ElementController(IHttpClientFactory httpClientFactory, SqliteContext context) : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
        private readonly SqliteContext _context = context;

        private readonly ColorController _colorController = new(httpClientFactory, context);
        private readonly PartController _partController = new(httpClientFactory, context);
        private readonly PartCategoryController _partCategoryController = new(httpClientFactory, context);

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
            foreach (var item in result!)
            {
                item.part_img_url = item.part!.part_img_url;
                item.part_url = item.part!.part_url;
            }
            return result!;
        }
        private static Element[] ConcatElements(List<Element> OrigList, List<Element> NewList)
        {
            OrigList.AddRange(NewList);
            return [.. OrigList];
        }

        public async Task SaveElements(string set_num)
        {
            //get the elements to save (this is coming from the initall set saving
            Element[]? elements = await GetAsync(set_num);
            
            //get all the colors, partCategory, and  parts in seperate condenced lists then check on them befor saving the element 
            Color[]? colors = elements.Select(c => c.color).DistinctBy(c1=>c1!.id).OrderBy(c2=>c2!.name).ToArray()!;
            Part[]? parts = elements.Select(p => p.part).DistinctBy(p1=>p1!.part_num).OrderBy(p2 => p2!.name).ToArray()!;
            int[]? partCategoryIds = parts.Select(pc => pc.part_cat_id).Distinct().Order().ToArray()!;

            await _partCategoryController.SaveCategories(partCategoryIds);
            await _partController.SaveParts(parts);
            await _colorController.SaveColors(colors);
            //check if each element is in the DB before adding

            foreach(var elem in elements)
            {
                Element? elementTest = GetSavedElementByItem(elem);
                if(elementTest == null)
                {
                    //ellement not saved,  save item
                    await CreateSavedItem(elem);
                }
            }
        }

        //CRUD Methods
        public async Task CreateSavedItem(Element element)
        {
            DBModels.Element dbElement = new(element);

            _context.Elements.Add(dbElement);
            _context.SaveChanges();    
        }
        public List<Element> ReadSavedItems()
        {
            List<Element> result = [];
            var dbElement = _context.Elements.ToList();
            foreach (var elem in dbElement)
            {
                var color = _colorController.GetSavedColorById(elem.color_id);
                var part = _partController.GetSavedPartById(elem.part_num_id!);

                result.Add( new Element(elem, color, part));
            }


            return result;
        }
        public Element? GetSavedElementByItem(Element element)
        {
            Element? result = null;
            var dbElement = _context.Elements.Where(x => x.element_id == element.element_id);

            if (!dbElement.Any()) return result;

            var color = _colorController.GetSavedColorById(dbElement.FirstOrDefault()!.color_id);
            var part = _partController.GetSavedPartById(dbElement.FirstOrDefault()!.part_num_id!);
            result = new Element(dbElement.FirstOrDefault()!, color, part);
            return result;
        }
        public void UpdateSavedItem(Element element)
        {
            DBModels.Element dbElement = new(element);
            _context.Elements.Update(dbElement);
            _context.SaveChanges();
        }
        public void DeleteSavedItem(Element element)
        {
            DBModels.Element dbElement = new(element);
            _context.Elements.Remove(dbElement);
            _context.SaveChanges();
        }

    }
}


