using System.Diagnostics;
using Core.Common.Logging;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Coordinator.Behaviors;

public class LoggingBehavior<TRequest, TResponse>(ILogger<LoggingBehavior<TRequest, TResponse>> logger, IExecutionContext context)
    : IPipelineBehavior<TRequest, TResponse> where TRequest : IRequest<TResponse>
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var commandName = request.GetType();
        context.SuppressLogging = true;
        logger.LogInformation("----- Handling command '{CommandName}'", commandName);

        var stopwatch = Stopwatch.StartNew();
        try
        {
            var response = await next();

            stopwatch.Stop();

            logger.LogInformation(
                "END {Request} ({Elapsed} ms) {@Response}",
                commandName,
                stopwatch.ElapsedMilliseconds,
                response
            );

            return response;
        }
        catch (Exception ex)
        {
            stopwatch.Stop();

            logger.LogError(
                ex,
                "ERROR {Request} ({Elapsed} ms)",
                commandName,
                stopwatch.ElapsedMilliseconds
            );

            throw;
        }
        finally
        {
            context.SuppressLogging = false;
        }
    }
}