using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace SarkiProje.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LyricsController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public LyricsController()
        {
            _httpClient = new HttpClient();
        }

        [HttpGet("{artist}/{title}")]
        public async Task<IActionResult> GetLyrics(string artist, string title)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(artist) || string.IsNullOrWhiteSpace(title))
                {
                    return BadRequest("Sanatçı ve şarkı adı boş olamaz.");
                }

                var response = await _httpClient.GetAsync($"https://api.lyrics.ovh/v1/{artist}/{title}");
                
                if (!response.IsSuccessStatusCode)
                {
                    if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                    {
                        return NotFound("Şarkı sözleri bulunamadı.");
                    }
                    return StatusCode((int)response.StatusCode, "Şarkı sözleri servisi şu anda kullanılamıyor.");
                }

                var content = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"API Yanıtı: {content}"); // API yanıtını logla

                // API yanıtını doğrudan döndür
                return Ok(content);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hata: {ex.Message}"); // Hatayı logla
                return StatusCode(500, $"Bir hata oluştu: {ex.Message}");
            }
        }
    }

    public class LyricsResponse
    {
        public string? Lyrics { get; set; }
    }
} 