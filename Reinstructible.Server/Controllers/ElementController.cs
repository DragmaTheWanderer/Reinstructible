using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Reinstructible.Server.DL;
using Reinstructible.Server.HTTPRequest;
using Reinstructible.Server.Models;
using System.Text.Json;
using System.Text.RegularExpressions;

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
        private readonly InventoryController _inventoryController = new(httpClientFactory, context);
        private readonly StorageController _storageController = new(httpClientFactory, context);

        [HttpGet]
        public async Task<Element[]> GetAsync(string id = "", string partId = "", string colorId = "", string param = "")
        {

            Element[]? result = param switch
            {
                "storage" => await GetElementsForStorage(partId, colorId),
                "storageCheck" => await GetElementsForStorageCheck(),
                _ => await GetInventory(id),
            };

            return result;
        }

        private async Task<Element[]> GetInventory(string id)
        {
            Element[]? result;
            //get parts from DB
            result = await GetElementsFromDB(id);
            //get parts from Reinstructiable
            result ??= await GetElementsFromAPI(id);
            return result;
        }

        private async Task<Element[]?> GetElementsForStorage(string partId, string colorId)
        {

            var result = await GetElementsByPartNumFromDB(partId);
            return result;
        }
        private async Task<Element[]> GetElementsFromDB(string id)
        {
            Element[]? result;
            var elementDB = GetSavedElementsBySetNumber(id);
            
            result = elementDB;
            return result!;
        }
        private async Task<Element[]> GetElementsFromAPI(string id)
        {
            var service = new RebrickableAPIService(_httpClientFactory);

            const string type = "sets";
            const string param = "parts";
            const string minifigs = "minifigs";
            const string elements = "elements";

            Element[]? result;
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
            //check minifig status,  then get the elements for the minifig and add to the list of elements to return
            var minifigResultStr = await service.GetRecordByIdAsync(type, id, minifigs);
            if (minifigResultStr != null) { 
                Minifigs? minifigsResults = JsonSerializer.Deserialize<Minifigs>(minifigResultStr);
                foreach(var item in minifigsResults!.results!)
                {
                    var minifigElementsString = await service.GetRecordByIdAsync(minifigs, item.set_num, param);
                    Elements? minifigElements = JsonSerializer.Deserialize<Elements>(minifigElementsString);
                    var minifigElementList = minifigElements!.results;
                    foreach (var m in minifigElementList!)
                    {
                        //check if item is in the DB then check the API if needed to get the missing properties
                        //set setnum of element to parent setnum
                        m.set_num = id;
                        var dbElement = GetSavedElementByItem(m);
                        if (dbElement != null)
                        {
                            m.part_img_url = dbElement.part_img_url;
                            m.alt_part_img_url = dbElement.alt_part_img_url;
                            m.part_url = dbElement.part_url;
                            m.set_num = id;
                            continue; //skip to next item
                        }
                        else
                        {
                            //check if the element ID is missing,  if not then search by it, if it is then try by part and color?
                            string missingElementString = "";
                            if (m.element_id != null)
                            {
                                missingElementString = await service.GetRecordByIdAsync(elements, m.element_id!);
                            }
                            else
                            {
                                missingElementString = await service.GetRecordPartByColor(m.part.part_num!, m.color!.id.ToString());
                            }
                            Element missingElementProps = JsonSerializer.Deserialize<Element>(missingElementString!)!;
                            m.set_num = id;
                            m.part_img_url = missingElementProps.part_img_url;
                            m.alt_part_img_url = missingElementProps.alt_part_img_url;
                            m.part_url = missingElementProps.part?.part_img_url ?? m.part_url;
                        }
                    }
                    result = ConcatElements([.. result!], [.. minifigElementList!]);
                }
            }


            return result!;
        }
        private async Task<Element[]?> GetElementsForStorageCheck()
        { //this will get all elements from the DB to check for storage locations
            List<Element> result = [];
            var elemDB = _context.Elements
                .FromSqlRaw(@"SELECT e.element_id, e.part_num_id, e.Color_id, e.part_img_url
                            FROM Parts p 
	                            left join(
		                            SELECT element_id, part_num_id, min(color_id) color_id, part_img_url
		                            FROM Elements
		                            GROUP BY part_num_id)
		                            as e on e.part_num_id = p.part_num	
                            Order By p.name")
                .ToList();
            foreach (var elem in elemDB)
            { //check if missing key properties

                result.Add(FillElementColorStoragePart(elem));
            }
                return [.. result];
        }

        private async Task<Element[]> GetElementsByPartNumFromDB(string partId)
        {
            List<Element> result = [];
            var elemDb = _context.Elements.Where(x => x.part_num_id == partId).ToArray();
            foreach (var elem in elemDb)
            {
                result.Add(FillElementColorStoragePart(elem));
            }
            return [.. result];
        }
  
        public async Task SaveElements(string set_num)
        {

            //get the elements to save (this is coming from the initall set saving
            Element[]? elements = await GetElementsFromAPI(set_num);
            
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
                //null elementID test
                if (elem.element_id == null)
                {
                    //element id should be able to be obtained via the part# and Color#
                    elem.element_id = elem.part!.part_num + "-" + elem.color!.id;
                }
                if (elementTest == null)
                {
                    //ellement not saved,  save item
                    await CreateSavedItem(elem);
                } 
                else
                {
                    await UpdateSavedItem(elem);
                }
                    await _inventoryController.CreateSavedItem(elem);
            }
        }

        //CRUD Methods
        public async Task CreateSavedItem(Element element)
        {
            DBModels.Element dbElement = new(element);

            var test = _context.Elements.Where(x => x.element_id == dbElement.element_id);
            if (!test.Any())
            {
                _context.Elements.Add(dbElement);
                _context.SaveChanges();
            }
        }
        public List<Element> ReadSavedItems()
        {
            List<Element> result = [];
            var dbElement = _context.Elements.ToList();
            foreach (var elem in dbElement)
            {
                var color = _colorController.GetSavedColorById(elem.color_id);
                var part = _partController.GetSavedPartById(elem.part_num_id!);
                var inventory = _inventoryController.GetSavedInventorysByElementId(elem.element_id!);
                var storage = _storageController.GetStorageByElementID(elem.element_id!);   
                foreach (var inv in inventory!)
                {
                    result.Add(new Element(dbe: elem, dbi: inv, color: color!, part: part!, storage: storage!));
                }
            }


            return result;
        }
        public Element[]? GetSavedElementsBySetNumber(string set_num)
        {
            List<Element>? result = [];
            var dbInventory = _context.Inventory.Where(x => x.set_num == set_num);

            if (!dbInventory.Any()) return null;

            foreach (var invDB in dbInventory)
            {
                var elem = GetElementFromInventory(invDB);
                result.Add(elem);
           }
            return [.. result];
        }

        public Element? GetSavedElementByItem(Element element)
        {
            Element? result = null;
            var dbInventory = _context.Inventory.Where(x => x.set_num == element.set_num);
            var dbElement = _context.Elements.Where(x => x.element_id == element.element_id);

            if (!dbInventory.Any()) return result;
            if (!dbElement.Any()) return result;

            result = FillElementColorStoragePart(dbElement.FirstOrDefault()!);
            return result;
        }

        public async Task UpdateSavedItem(Element element)
        {

            DBModels.Element dbElement = _context.Elements.Where(x => x.element_id == element.element_id).FirstOrDefault()!;
            dbElement.UpdateFrom(element);
            _context.Elements.Update(dbElement);
            _context.SaveChanges();
        }
        public void DeleteSavedItem(Element element)
        {
            DBModels.Element dbElement = new(element);
            _context.Elements.Remove(dbElement);
            _context.SaveChanges();
        }
        private Element GetElementFromInventory(DBModels.Inventory invDB)
        {
            Element result = new();
            var dbElement = _context.Elements.Where(x => x.element_id == invDB.element_id).FirstOrDefault();
            result = FillElementColorStoragePart(dbElement!);
            result.quantity = invDB.quantity;
            return result;
        }
        private Element FillElementColorStoragePart(DBModels.Element elem)
        {
            Element result = new();
            //makes sure to add the part, color, storage classes to the element
            var colorDB = _colorController.GetSavedColorById(elem.color_id);
            var partDB = _partController.GetSavedPartById(elem.part_num_id!);
            var storageDB = _storageController.GetStorageByElementID(elem.element_id!);

            result = new Element(elem, colorDB!, partDB!, storageDB!);

            return result;
        }
        private static Element[] ConcatElements(List<Element> OrigList, List<Element> NewList)
        {
            OrigList.AddRange(NewList);
            return [.. OrigList];
        }


    }
}


