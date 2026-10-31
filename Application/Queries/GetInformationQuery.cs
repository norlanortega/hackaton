using AutoMapper;
using Copa.OCC.Api.Application.DTOs;
using Copa.OCC.Api.Domain.Enums;
using Copa.OCC.Api.Domain.Interfaces;
using MediatR;

namespace Copa.OCC.Api.Application.Queries;

public record GetInformationQuery(
    string? Origin = null,
    string? Destination = null,
    FlightStatus? Status = null,
    DateTime? Date = null) : IRequest<IEnumerable<FlightDto>>;

public class GetInformationQueryHandler(IFlightRepository repository, IMapper mapper)
    : IRequestHandler<GetInformationQuery, IEnumerable<FlightDto>>
{
    public async Task<IEnumerable<FlightDto>> Handle(GetInformationQuery request, CancellationToken cancellationToken)
    {
        var flights = await repository.GetFlightsAsync(
            request.Origin, request.Destination, request.Status, request.Date, cancellationToken);
        return mapper.Map<IEnumerable<FlightDto>>(flights);
    }
}
