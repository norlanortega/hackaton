namespace Copa.OCC.Api.Presentation.Middleware;

public class FrontendHandshakeMiddleware(RequestDelegate next, IConfiguration configuration)
{
    public async Task InvokeAsync(HttpContext context, FrontendHandshakeState state, ILogger<FrontendHandshakeMiddleware> logger)
    {
        if (!state.IsVerified
            && context.Request.Headers.TryGetValue("Origin", out var origin)
            && IsAllowed(origin.ToString()))
        {
            var path = context.Request.Path;

            if (path.StartsWithSegments("/api/information", StringComparison.OrdinalIgnoreCase))
            {
                state.MarkInformation();
                logger.LogInformation("Information endpoint reached from origin {Origin}", origin.ToString());
            }
            else if (path.StartsWithSegments("/api/services", StringComparison.OrdinalIgnoreCase))
            {
                state.MarkServices();
                logger.LogInformation("Services endpoint reached from origin {Origin}", origin.ToString());
            }
        }

        await next(context);
    }

    private bool IsAllowed(string origin)
    {
        var allowed = configuration["AllowedOrigins"] ?? string.Empty;
        return allowed
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Any(o => string.Equals(o, origin, StringComparison.OrdinalIgnoreCase));
    }
}
