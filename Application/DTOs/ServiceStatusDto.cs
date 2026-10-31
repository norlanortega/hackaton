using Copa.OCC.Api.Domain.Enums;

namespace Copa.OCC.Api.Application.DTOs;

public class ServiceStatusDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ServiceAvailability Availability { get; set; }
    public string AvailabilityLabel { get; set; } = string.Empty;
    public DateTime LastChecked { get; set; }
}
