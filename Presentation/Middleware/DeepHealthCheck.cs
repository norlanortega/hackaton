using Copa.OCC.Api.Infrastructure.Persistence;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Copa.OCC.Api.Presentation.Middleware;

public class DeepHealthCheck(
    OccDbContext dbContext,
    IConfiguration configuration,
    FrontendHandshakeState handshake,
    ILogger<DeepHealthCheck> logger) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        if (!handshake.IsVerified)
        {
            logger.LogWarning(
                "Deep health check blocked: frontend connectivity not verified. ErrorCode={ErrorCode}", "E4");
            return HealthCheckResult.Degraded(
                "Error E4",
                data: new Dictionary<string, object>
                {
                    ["errorCode"] = "E4",
                    ["reason"] = "Conectividad del frontend no verificada"
                });
        }

        var mode = configuration["HealthCheckMode"] ?? "basic";

        if (mode != "deep")
        {
            logger.LogWarning(
                "Deep health check skipped: mode is {Mode}, expected \"deep\". ErrorCode={ErrorCode}", mode, "E4");
            return HealthCheckResult.Degraded(
                "Error E4",
                data: new Dictionary<string, object>
                {
                    ["errorCode"] = "E4",
                    ["mode"] = mode,
                    ["reason"] = "El modo del health check no es deep"
                });
        }

        try
        {
            var canConnect = await dbContext.Database.CanConnectAsync(cancellationToken);
            var data = new Dictionary<string, object> { ["mode"] = mode, ["database"] = canConnect ? "ok" : "fail" };
            return canConnect
                ? HealthCheckResult.Healthy("Deep check passed", data)
                : HealthCheckResult.Unhealthy("Database unavailable", data: data);
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("Deep check failed", ex);
        }
    }
}
