using Copa.OCC.Api.Domain.Entities;
using Copa.OCC.Api.Domain.Interfaces;
using Copa.OCC.Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Copa.OCC.Api.Infrastructure.Repositories;

public class ServiceStatusRepository(OccDbContext context) : IServiceStatusRepository
{
    public async Task<IEnumerable<ServiceStatus>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await context.ServiceStatuses
            .AsNoTracking()
            .OrderBy(s => s.Name)
            .ToListAsync(cancellationToken);
    }
}
