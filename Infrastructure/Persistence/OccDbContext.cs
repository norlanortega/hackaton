using Copa.OCC.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Copa.OCC.Api.Infrastructure.Persistence;

public class OccDbContext(DbContextOptions<OccDbContext> options) : DbContext(options)
{
    public DbSet<Flight> Flights => Set<Flight>();
    public DbSet<ServiceStatus> ServiceStatuses => Set<ServiceStatus>();
}
