using Microsoft.EntityFrameworkCore.Storage;

namespace Coordinator.interfaces;

public interface ICoordinatorContext
{
    public Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default);
}