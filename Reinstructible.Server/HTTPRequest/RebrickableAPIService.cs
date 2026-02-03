using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Net.Http.Headers;
using Reinstructible.Server.Models;
using System.Net.Http;
using System.Text.Json;

namespace Reinstructible.Server.HTTPRequest
{
    public class RebrickableAPIService(IHttpClientFactory httpClientFactory)
    {
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
        private const string path = "/api/v3/lego/{0}/";
        private const string pathSearch = "/api/v3/lego/{0}/?search={1}";
        private const string pathId = "/api/v3/lego/{0}/{1}/";
        private const string pathIdParam = "/api/v3/lego/{0}/{1}/{2}/";
        private const string pathIdPartByColor = "/api/v3/lego/parts/{0}/colors/{1}/";
        private const int delayMS = 1000; // Delay in milliseconds
        public async Task<string> GetRecordsAsync(string type, string filter = "")
        {
            var pathFinal = string.IsNullOrEmpty(filter) ?
                string.Format(path, type):
                string.Format(pathSearch, type, filter + "-");

            // Create the client using the named configuration
            var client = _httpClientFactory.CreateClient("RebrickableApi");

            await Task.Delay(delayMS); // To avoid hitting rate limits
            var response = await client.GetAsync(pathFinal);
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadAsStringAsync();
        }

        public async Task<string> GetRecordByIdAsync(string type, string id)
        {
            var pathFinal = string.Format(pathId, type, id);
            // Create the client using the named configuration
            var client = _httpClientFactory.CreateClient("RebrickableApi");
            HttpResponseMessage response;
            try
            {
                await Task.Delay(delayMS); // To avoid hitting rate limits
                response = await client.GetAsync(pathFinal);
                response.EnsureSuccessStatusCode();

            }
            catch (Exception)
            {

                throw;
            }

            return await response.Content.ReadAsStringAsync();

        }

        public async Task<string> GetRecordByIdAsync(string type, string id, string param)
        {
            var pathFinal = string.Format(pathIdParam, type, id, param);
            // Create the client using the named configuration
            var client = _httpClientFactory.CreateClient("RebrickableApi");

            await Task.Delay(delayMS); // To avoid hitting rate limits
            var response = await client.GetAsync(pathFinal);
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadAsStringAsync();
        }
        public async Task<string> GetRecordPartByColor(string partId, string colorId)
        {
            var pathFinal = string.Format(pathIdPartByColor, partId, colorId);
            // Create the client using the named configuration
            var client = _httpClientFactory.CreateClient("RebrickableApi");

            await Task.Delay(delayMS); // To avoid hitting rate limits
            var response = await client.GetAsync(pathFinal);
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadAsStringAsync();
        }
        public async Task<string> GetRecordByURLAsync(string pathFinal)
        {
             // Create the client using the named configuration
            var client = _httpClientFactory.CreateClient("RebrickableApi");

            await Task.Delay(delayMS); // To avoid hitting rate limits
            var response = await client.GetAsync(pathFinal);
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadAsStringAsync();
        }
    }
}
