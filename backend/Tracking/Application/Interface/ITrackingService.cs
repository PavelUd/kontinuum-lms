using Core;
using Tracking.Application.DTO;

namespace Tracking.Application.Interface;

public interface ITrackingService
{
    public Task<Result<None>> SaveAttempt(SaveAttemptRequest request);
}