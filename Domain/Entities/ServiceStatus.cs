using Copa.OCC.Api.Domain.Enums;

namespace Copa.OCC.Api.Domain.Entities;

public class ServiceStatus
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ServiceAvailability Availability { get; set; }
    public DateTime LastChecked { get; set; }
}
