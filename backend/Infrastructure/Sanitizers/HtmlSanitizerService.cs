using BlockEngine.Application.Interfaces;
using Ganss.Xss;

namespace Infrastructure.Sanitizers;

public class HtmlSanitizerService : IContentSanitizer
{
    private readonly HtmlSanitizer _sanitizer = new();

    
    private static readonly string[] AllowedTags =
    [
        "p","br","strong","b","em","i","u","s","span",
        "ul","ol","li",
        "blockquote",
        "code","pre",
        "h1","h2","h3","h4","h5","h6",
        "a",
        "table","thead","tbody","tr","td","th",
        "img"
    ];

    private static readonly string[] AllowedAttributes =
    [
        "href","target","rel",
        "src","alt","title",
        "class",
        "style",
        "colspan","rowspan"
    ];

    private static readonly string[] AllowedCssProperties =
    [
        "text-align"
    ];

    private static readonly string[] AllowedSchemes =
    [
        "http","https","mailto"
    ];

    private static readonly string[] AllowedClasses =
    [
        "ProseMirror",
        "katex",
        "katex-html",
        "katex-mathml"
    ];

    public HtmlSanitizerService()
    {
        _sanitizer = new HtmlSanitizer();

        _sanitizer.AllowedTags.Clear();
        _sanitizer.AllowedAttributes.Clear();
        _sanitizer.AllowedSchemes.Clear();
        _sanitizer.AllowedCssProperties.Clear();

        foreach (var tag in AllowedTags)
            _sanitizer.AllowedTags.Add(tag);

        foreach (var attr in AllowedAttributes)
            _sanitizer.AllowedAttributes.Add(attr);

        foreach (var scheme in AllowedSchemes)
            _sanitizer.AllowedSchemes.Add(scheme);

        foreach (var cls in AllowedClasses)
            _sanitizer.AllowedClasses.Add(cls);
        
        foreach (var prop in AllowedCssProperties)
            _sanitizer.AllowedCssProperties.Add(prop);
    }
    
    public string Sanitize(string html)
    {
        return _sanitizer.Sanitize(html);
    }
}