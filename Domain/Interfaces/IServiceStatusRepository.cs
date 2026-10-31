using Copa.OCC.Api.Domain.Entities;

namespace Copa.OCC.Api.Domain.Interfaces;

public interface IServiceStatusRepository
{
    Task<IEnumerable<ServiceStatus>> GetAllAsync(CancellationToken cancellationToken = default);
}
