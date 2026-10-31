using Copa.OCC.Api.Application.Queries;
using Copa.OCC.Api.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Copa.OCC.Api.Presentation.Controllers;

[ApiController]
[Route("api/information")]
public class InformationController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetInformation(
        [FromQuery] string? origin,
        [FromQuery] string? destination,
        [FromQuery] FlightStatus? status,
        [FromQuery] DateTime? date,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(
            new GetInformationQuery(origin, destination, status, date), cancellationToken);
        return Ok(result);
    }
}
