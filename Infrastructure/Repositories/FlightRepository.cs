using Copa.OCC.Api.Domain.Entities;
using Copa.OCC.Api.Domain.Enums;
using Copa.OCC.Api.Domain.Interfaces;
using Copa.OCC.Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Copa.OCC.Api.Infrastructure.Repositories;

public class FlightRepository(OccDbContext context) : IFlightRepository
{
    public async Task<IEnumerable<Flight>> GetFlightsAsync(
        string? origin,
        string? destination,
        FlightStatus? status,
        DateTime? date,
        CancellationToken cancellationToken = default)
    {
        var query = context.Flights.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(origin))
            query = query.Where(f => f.Origin.ToLower().Contains(origin.ToLower()));

        if (!string.IsNullOrWhiteSpace(destination))
            query = query.Where(f => f.Destination.ToLower().Contains(destination.ToLower()));

        if (status.HasValue)
            query = query.Where(f => f.Status == status.Value);

        if (date.HasValue)
            query = query.Where(f => f.ScheduledDeparture.Date == date.Value.Date);

        return await query.OrderBy(f => f.ScheduledDeparture).ToListAsync(cancellationToken);
    }
}
