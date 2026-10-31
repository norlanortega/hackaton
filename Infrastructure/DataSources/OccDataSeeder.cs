using Copa.OCC.Api.Domain.Entities;
using Copa.OCC.Api.Domain.Enums;
using Copa.OCC.Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Copa.OCC.Api.Infrastructure.DataSources;

public class OccDataSeeder(IServiceProvider serviceProvider) : IHostedService
{
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<OccDbContext>();

        if (await context.Flights.CountAsync(cancellationToken) > 0) return;

        var now = DateTime.UtcNow;

        context.Flights.AddRange(
            // Scheduled (4)
            new Flight { Id = Guid.NewGuid(), FlightNumber = "CM101", Origin = "PTY", Destination = "BOG", ScheduledDeparture = now.AddHours(2), EstimatedDeparture = now.AddHours(2), Status = FlightStatus.Scheduled },
            new Flight { Id = Guid.NewGuid(), FlightNumber = "CM203", Origin = "PTY", Destination = "MIA", ScheduledDeparture = now.AddHours(3), EstimatedDeparture = now.AddHours(3), Status = FlightStatus.Scheduled },
            new Flight { Id = Guid.NewGuid(), FlightNumber = "CM305", Origin = "GUA", Destination = "PTY", ScheduledDeparture = now.AddHours(4), EstimatedDeparture = now.AddHours(4), Status = FlightStatus.Scheduled },
            new Flight { Id = Guid.NewGuid(), FlightNumber = "CM407", Origin = "SAL", Destination = "PTY", ScheduledDeparture = now.AddHours(5), EstimatedDeparture = now.AddHours(5), Status = FlightStatus.Scheduled },
            // InTransit (4)
            new Flight { Id = Guid.NewGuid(), FlightNumber = "CM102", Origin = "PTY", Destination = "LIM", ScheduledDeparture = now.AddHours(-1), EstimatedDeparture = now.AddHours(-1), Status = FlightStatus.InTransit },
            new Flight { Id = Guid.NewGuid(), FlightNumber = "CM204", Origin = "PTY", Destination = "JFK", ScheduledDeparture = now.AddHours(-2), EstimatedDeparture = now.AddHours(-2), Status = FlightStatus.InTransit },
            new Flight { Id = Guid.NewGuid(), FlightNumber = "CM306", Origin = "MEX", Destination = "PTY", ScheduledDeparture = now.AddHours(-1.5), EstimatedDeparture = now.AddHours(-1), Status = FlightStatus.InTransit },
            new Flight { Id = Guid.NewGuid(), FlightNumber = "CM408", Origin = "GYE", Destination = "PTY", ScheduledDeparture = now.AddHours(-0.5), EstimatedDeparture = now.AddHours(-0.5), Status = FlightStatus.InTransit },
            // Delayed (4)
            new Flight { Id = Guid.NewGuid(), FlightNumber = "CM103", Origin = "PTY", Destination = "SCL", ScheduledDeparture = now.AddHours(1), EstimatedDeparture = now.AddHours(3), Status = FlightStatus.Delayed },
            new Flight { Id = Guid.NewGuid(), FlightNumber = "CM205", Origin = "PTY", Destination = "MAD", ScheduledDeparture = now.AddHours(2), EstimatedDeparture = now.AddHours(5), Status = FlightStatus.Delayed },
            new Flight { Id = Guid.NewGuid(), FlightNumber = "CM307", Origin = "SJO", Destination = "PTY", ScheduledDeparture = now.AddHours(-0.5), EstimatedDeparture = now.AddHours(1.5), Status = FlightStatus.Delayed },
            new Flight { Id = Guid.NewGuid(), FlightNumber = "CM409", Origin = "CCS", Destination = "PTY", ScheduledDeparture = now.AddHours(1), EstimatedDeparture = now.AddHours(2.5), Status = FlightStatus.Delayed, Diverted = true },
            // Cancelled (4)
            new Flight { Id = Guid.NewGuid(), FlightNumber = "CM104", Origin = "PTY", Destination = "UIO", ScheduledDeparture = now.AddHours(1), EstimatedDeparture = now.AddHours(1), Status = FlightStatus.Cancelled },
            new Flight { Id = Guid.NewGuid(), FlightNumber = "CM206", Origin = "PTY", Destination = "EZE", ScheduledDeparture = now.AddHours(2), EstimatedDeparture = now.AddHours(2), Status = FlightStatus.Cancelled },
            new Flight { Id = Guid.NewGuid(), FlightNumber = "CM308", Origin = "TGU", Destination = "PTY", ScheduledDeparture = now, EstimatedDeparture = now, Status = FlightStatus.Cancelled },
            new Flight { Id = Guid.NewGuid(), FlightNumber = "CM410", Origin = "MGA", Destination = "PTY", ScheduledDeparture = now.AddHours(-1), EstimatedDeparture = now.AddHours(-1), Status = FlightStatus.Cancelled },
            // Landed (4)
            new Flight { Id = Guid.NewGuid(), FlightNumber = "CM105", Origin = "BOG", Destination = "PTY", ScheduledDeparture = now.AddHours(-4), EstimatedDeparture = now.AddHours(-4), Status = FlightStatus.Landed },
            new Flight { Id = Guid.NewGuid(), FlightNumber = "CM207", Origin = "MIA", Destination = "PTY", ScheduledDeparture = now.AddHours(-3), EstimatedDeparture = now.AddHours(-3), Status = FlightStatus.Landed },
            new Flight { Id = Guid.NewGuid(), FlightNumber = "CM309", Origin = "PTY", Destination = "GUA", ScheduledDeparture = now.AddHours(-5), EstimatedDeparture = now.AddHours(-5), Status = FlightStatus.Landed },
            new Flight { Id = Guid.NewGuid(), FlightNumber = "CM411", Origin = "LIM", Destination = "PTY", ScheduledDeparture = now.AddHours(-2), EstimatedDeparture = now.AddHours(-2), Status = FlightStatus.Landed }
        );

        context.ServiceStatuses.AddRange(
            new ServiceStatus { Id = Guid.NewGuid(), Name = "Flight Data Service", Description = "Distribuye datos en tiempo real de vuelos", Availability = ServiceAvailability.Available, LastChecked = now },
            new ServiceStatus { Id = Guid.NewGuid(), Name = "Reservations System", Description = "Gestiona reservas y check-in de pasajeros", Availability = ServiceAvailability.Available, LastChecked = now },
            new ServiceStatus { Id = Guid.NewGuid(), Name = "Crew Management", Description = "Asignación y seguimiento de tripulación", Availability = ServiceAvailability.Available, LastChecked = now },
            new ServiceStatus { Id = Guid.NewGuid(), Name = "Baggage Tracking", Description = "Seguimiento de equipaje en tiempo real", Availability = ServiceAvailability.Available, LastChecked = now },
            new ServiceStatus { Id = Guid.NewGuid(), Name = "Weather Integration", Description = "Servicio de datos meteorológicos", Availability = ServiceAvailability.Available, LastChecked = now },
            new ServiceStatus { Id = Guid.NewGuid(), Name = "ACARS Gateway", Description = "Comunicación digital con aeronaves", Availability = ServiceAvailability.Available, LastChecked = now }
        );

        await context.SaveChangesAsync(cancellationToken);
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
