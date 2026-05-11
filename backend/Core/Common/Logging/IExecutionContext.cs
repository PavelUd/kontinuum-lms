namespace Core.Common.Logging;

public interface IExecutionContext
{
    bool SuppressLogging { get; set; }
}