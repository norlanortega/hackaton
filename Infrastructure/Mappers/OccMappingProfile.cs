using AutoMapper;
using Copa.OCC.Api.Application.DTOs;
using Copa.OCC.Api.Domain.Entities;
using Copa.OCC.Api.Domain.Enums;

namespace Copa.OCC.Api.Infrastructure.Mappers;

public class OccMappingProfile : Profile
{
    public OccMappingProfile()
    {
        CreateMap<Flight, FlightDto>()
            .ForMember(d => d.StatusLabel, opt => opt.MapFrom(s => s.Status.ToString()))
            .ForMember(d => d.IsAlert, opt => opt.MapFrom(s =>
                s.Status == FlightStatus.Delayed || s.Status == FlightStatus.Cancelled));

        CreateMap<ServiceStatus, ServiceStatusDto>()
            .ForMember(d => d.AvailabilityLabel, opt => opt.MapFrom(s => s.Availability.ToString()));
    }
}
