using Copa.OCC.Api.Application.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Copa.OCC.Api.Presentation.Controllers;

[ApiController]
[Route("api/services")]
public class ServiceStatusController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetServiceStatuses(CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetServiceStatusQuery(), cancellationToken);
        return Ok(result);
    }
}
