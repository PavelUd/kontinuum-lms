using Core.Common.Logging;

namespace Infrastructure.Logging;

public class ExecutionContext : IExecutionContext
{
    public bool SuppressLogging { get; set; }
}