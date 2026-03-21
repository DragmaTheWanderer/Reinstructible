using Microsoft.AspNetCore.Mvc;
using Reinstructible.Server.Models;
using System;
using System.IO;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization.Metadata;


namespace Reinstructible.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private const string filePath = @"C:\Temp\"; // Use an appropriate file path


        [HttpGet]
        public async Task<string> GetAsync(string fileName)
        {
            //get the saved items
            string jsonStr = "";
            string file = filePath + fileName;
            try
            { 
                if (System.IO.File.Exists(file))
                {
                    // Read all text from the file asynchronously
                    string fileContents = await System.IO.File.ReadAllTextAsync(file);

                    // Pass the content to the view
                    jsonStr = fileContents;
                }
                else
                {
                    jsonStr = "File not found.";
                }
            }
            catch (IOException e)
            {
                jsonStr = $"The file could not be read: {e.Message}";
            }
            //return the JsonString
            
            return jsonStr!;
        }

        [HttpPost]
        public async void PostAsync([FromBody] JsonObject data) {
            //save the current model being worked on in its state.


            var fileName = data["fileName"];
            var jsonString = data["jsonString"]!;


            //Save the Jason String locally
            string file = filePath + fileName;
            try
            {
                // Write the string to the file
                await System.IO.File.WriteAllTextAsync(file, jsonString.ToString());
                Console.WriteLine($"Successfully wrote to the file at: {filePath}");
            }
            catch (IOException ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
            }
        }

    }
}
