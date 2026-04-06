namespace Core.Common.Pagination;

public class QueryBase : PagedQuery
{
    public string? Search { get; set; }

    public string? SortBy { get; set; }

    public bool Desc { get; set; } = false;
}