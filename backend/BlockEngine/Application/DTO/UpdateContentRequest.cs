using System.Text.Json;

namespace BlockEngine.Application.DTO;

public class UpdateContentRequest
{
    public JsonElement Content  { get; set; }
}