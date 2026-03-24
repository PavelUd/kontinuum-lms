using System.Text.Json;

namespace BlockEngine.Application.DTO;

public record BlockEvaluateItem(Guid BlockId, JsonElement Payload);