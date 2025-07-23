using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

public static class ApiHelper
{
    public static async Task<T?> PostJsonAsync<T>(string url, object payload, string bearerToken, ILogger logger)
    {
        try
        {
            using var client = new HttpClient();
            
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", bearerToken);

            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            using var response = await client.PostAsync(url, content);

            response.EnsureSuccessStatusCode();

            var responseString = await response.Content.ReadAsStringAsync();
            logger.LogInformation($"POST {url} succeeded. Status: {response.StatusCode}");
            return JsonSerializer.Deserialize<T>(responseString);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"Error occurred while posting to {url}");
            return default;
        }
    }
}
