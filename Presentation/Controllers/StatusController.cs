using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Copa.OCC.Api.Presentation.Controllers;

[ApiController]
[Route("api/status")]
public class StatusController(
    IConfiguration configuration,
    HealthCheckService healthCheckService,
    ILogger<StatusController> logger) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetStatus(CancellationToken cancellationToken)
    {
        var report = await healthCheckService.CheckHealthAsync(
            registration => registration.Name == "deep", cancellationToken);

        if (report.Status != HealthStatus.Healthy)
        {
            logger.LogWarning(
                "Status unavailable: deep health check is {HealthStatus}. ErrorCode={ErrorCode}",
                report.Status, "E5");
            return StatusCode(503, new
            {
                available = false,
                errorCode = "E5",
                message = "Error E5",
                reason = "La verificacion profunda de salud no esta en estado Healthy"
            });
        }

        var enabled = configuration.GetValue<bool>("FeatureFlags:EnableFinalValidation");
        if (!enabled)
        {
            logger.LogWarning(
                "Status unavailable: final validation feature flag disabled. ErrorCode={ErrorCode}", "E5");
            return StatusCode(503, new
            {
                available = false,
                errorCode = "E5",
                message = "Error E5",
                reason = "La validacion final esta deshabilitada"
            });
        }

        return Ok(new { available = true, timestamp = DateTime.UtcNow });
    }
}
