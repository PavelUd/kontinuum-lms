using System.Diagnostics;
using AspectCore.DynamicProxy;
using Core.Common.Logging;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Logging;

public class LoggingAttribute : AbstractInterceptorAttribute
{
    public override async Task Invoke(AspectContext context, AspectDelegate next)
    {
        var execContext = context.ServiceProvider.GetService<IExecutionContext>();
        
        if (execContext?.SuppressLogging == true)
        {
            await next(context);
            return;
        }

        var logger = context.ServiceProvider
            .GetService<ILogger<LoggingAttribute>>();

        var method = context.ImplementationMethod.Name;

        var stopwatch = Stopwatch.StartNew();

        logger?.LogInformation("START {Method}", method);

        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            logger?.LogError(ex, "ERROR {Method}", method);
            throw;
        }
        finally
        {
            stopwatch.Stop();

            logger?.LogInformation(
                "END {Method} ({Elapsed} ms)",
                method,
                stopwatch.ElapsedMilliseconds
            );
        }
    }
}