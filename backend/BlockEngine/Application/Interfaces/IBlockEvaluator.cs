using System.Text.Json;

namespace BlockEngine.Application.Interfaces;

public interface IBlockEvaluator
{
    public Task<bool> EvaluateAsync(JsonElement payload, JsonElement content);
}