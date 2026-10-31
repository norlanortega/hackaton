using Copa.OCC.Api.Domain.Enums;

namespace Copa.OCC.Api.Domain.Entities;

public class Flight
{
    public Guid Id { get; set; }
    public string FlightNumber { get; set; } = string.Empty;
    public string Origin { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public DateTime ScheduledDeparture { get; set; }
    public DateTime EstimatedDeparture { get; set; }
    public FlightStatus Status { get; set; }
    public bool Diverted { get; set; }
}
