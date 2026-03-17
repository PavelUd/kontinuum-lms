using System.Text.Json;

namespace BlockEngine.Application.Interfaces;

public interface ISafeHtmlPlugin
{
    public JsonElement Sanitize(JsonElement content);
}