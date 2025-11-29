using Microsoft.AspNetCore.Mvc;

namespace Reinstructible.Server.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class TestStringController : ControllerBase
    {


        [HttpGet]
        public TestString Get()
        {
            var result = new TestString { Value = "this is a test" };

            return result;
        }
    }
}
