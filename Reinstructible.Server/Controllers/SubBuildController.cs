using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Reinstructible.Server.DL;
using Reinstructible.Server.Models;
using System.Text.Json;

namespace Reinstructible.Server.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class SubBuildController(IHttpClientFactory httpClientFactory, SqliteContext context) : ControllerBase
  {
    private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
    private readonly SqliteContext _context = context;

    [HttpGet]
    public async Task<SubInventory[]?> GetAsync(string id)
    {
      List<SubInventory> result = [];





      return [.. result];
    }
    [HttpPost]
    public async Task<IActionResult> PostAsync([FromBody] JsonElement subInventoryItem)
    {
      SubInventory subInventory = JsonSerializer.Deserialize<SubInventory>(subInventoryItem)!;
      int newID = CreateSavedItem(subInventory);
      return Ok(newID);
    }
    [HttpPut]
    public async Task<IActionResult> PutAsync([FromBody] JsonElement subInventoryItem)
    {
      SubInventory subInventory = JsonSerializer.Deserialize<SubInventory>(subInventoryItem)!;
      UpdateSavedItem(subInventory);
      return Ok();
    }
    [HttpDelete]
    public async Task<IActionResult> DeleteAsync(string set_num, string element_id )
    {
      //dbModels.SubInventory subInventory = GetSavedSubInventoryById(set_num, element_id);
      DeleteSavedItem(set_num, element_id);
      return Ok();
    }

    //CRUD Methods
    public int CreateSavedItem(SubInventory SubInventory)
    {
      DBModels.SubInventory dbSubInventory = new(SubInventory);
      _context.SubInventories.Add(dbSubInventory);
      _context.SaveChanges();
      return dbSubInventory.id;


    }
    public List<SubInventory> ReadSavedItems()
    {
      List<SubInventory> result = [];
      var dbSubInventory = _context.SubInventories.OrderBy(x => x.page).ThenBy(x=>x.step).ToList();
      foreach (var item in dbSubInventory)
      {
        result.Add(new SubInventory(item));
      }

      return result;
    }
    public SubInventory? GetSavedSubInventoryByItem(SubInventory SubInventory)
    {
      SubInventory? result = null;
      var dbSubInventory = _context.SubInventories.Where(x => x.set_num == SubInventory.set_num).Where(x => x.element_id == SubInventory.element_id);

      if (!dbSubInventory.Any()) return result;

      result = new SubInventory(dbSubInventory.FirstOrDefault()!);
      return result;
    }

    public List<SubInventory> GetSavedSubInventoryById(string set_num, string element_id)
    {
      List<SubInventory> result = new();
      var dbSubInventory = _context.SubInventories.Where(x => x.set_num == set_num).Where(x => x.element_id == element_id);

      if (!dbSubInventory.Any()) return result;

      foreach (var item in dbSubInventory)
      {
        result.Add(new SubInventory(item));
      }
      return result;
    }

    public void UpdateSavedItem(SubInventory SubInventory)
    {
      DBModels.SubInventory dbSubInventory = new(SubInventory);
      _context.SubInventories.Update(dbSubInventory);
      _context.SaveChanges();
    }
    public void DeleteSavedItem(string set_num, string element_id)
    {
      var dbSubInventory = _context.SubInventories.Where(x => x.set_num == set_num).Where(x => x.element_id == element_id).FirstOrDefault();
      _context.SubInventories.Remove(dbSubInventory!);
      _context.SaveChanges();
    }

  }

}

