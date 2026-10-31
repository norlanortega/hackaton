using Copa.OCC.Api.Domain.Enums;

namespace Copa.OCC.Api.Application.DTOs;

public class FlightDto
{
    public Guid Id { get; set; }
    public string FlightNumber { get; set; } = string.Empty;
    public string Origin { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public DateTime ScheduledDeparture { get; set; }
    public DateTime EstimatedDeparture { get; set; }
    public FlightStatus Status { get; set; }
    public string StatusLabel { get; set; } = string.Empty;
    public bool Diverted { get; set; }
    public bool IsAlert { get; set; }
}
