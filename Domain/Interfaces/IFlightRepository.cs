using Copa.OCC.Api.Domain.Entities;
using Copa.OCC.Api.Domain.Enums;

namespace Copa.OCC.Api.Domain.Interfaces;

public interface IFlightRepository
{
    Task<IEnumerable<Flight>> GetFlightsAsync(
        string? origin,
        string? destination,
        FlightStatus? status,
        DateTime? date,
        CancellationToken cancellationToken = default);
}
