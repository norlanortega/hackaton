using AutoMapper;
using Copa.OCC.Api.Application.DTOs;
using Copa.OCC.Api.Domain.Interfaces;
using MediatR;

namespace Copa.OCC.Api.Application.Queries;

public record GetServiceStatusQuery : IRequest<IEnumerable<ServiceStatusDto>>;

public class GetServiceStatusQueryHandler(IServiceStatusRepository repository, IMapper mapper)
    : IRequestHandler<GetServiceStatusQuery, IEnumerable<ServiceStatusDto>>
{
    public async Task<IEnumerable<ServiceStatusDto>> Handle(GetServiceStatusQuery request, CancellationToken cancellationToken)
    {
        var statuses = await repository.GetAllAsync(cancellationToken);
        return mapper.Map<IEnumerable<ServiceStatusDto>>(statuses);
    }
}
