using Copa.OCC.Api.Domain.Interfaces;
using Copa.OCC.Api.Infrastructure.DataSources;
using Copa.OCC.Api.Infrastructure.Persistence;
using Copa.OCC.Api.Infrastructure.Repositories;
using Copa.OCC.Api.Presentation.Middleware;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using Serilog;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Serilog
builder.Host.UseSerilog((ctx, sp, lc) =>
{
    lc.ReadFrom.Configuration(ctx.Configuration).WriteTo.Console();

    var telemetryConfiguration = sp.GetService<TelemetryConfiguration>();
    if (!string.IsNullOrWhiteSpace(telemetryConfiguration?.ConnectionString))
        lc.WriteTo.ApplicationInsights(telemetryConfiguration, TelemetryConverter.Traces);
});

// Application Insights
var appInsightsConnectionString = builder.Configuration["ApplicationInsights:ConnectionString"];
if (!string.IsNullOrWhiteSpace(appInsightsConnectionString))
    builder.Services.AddApplicationInsightsTelemetry(options =>
        options.ConnectionString = appInsightsConnectionString);
else
    builder.Services.AddApplicationInsightsTelemetry();

// EF Core InMemory
builder.Services.AddDbContext<OccDbContext>(options =>
    options.UseInMemoryDatabase("OccDb"));

var allowedOrigins = builder.Configuration["AllowedOrigins"] ?? "http://localhost:4200";
builder.Services.AddCors(options =>
{
    options.AddPolicy("OccCorsPolicy", policy =>
        policy.WithOrigins(allowedOrigins.Split(',', StringSplitOptions.RemoveEmptyEntries))
              .AllowAnyMethod()
              .AllowAnyHeader());
    // Política exclusiva para el probe de conectividad — siempre permite cualquier origen
    options.AddPolicy("ProbePolicy", policy =>
        policy.AllowAnyOrigin().WithMethods("GET").AllowAnyHeader());
});

// MediatR
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

// AutoMapper
builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());

// Repositories
builder.Services.AddScoped<IFlightRepository, FlightRepository>();
builder.Services.AddScoped<IServiceStatusRepository, ServiceStatusRepository>();

// Data seeder
builder.Services.AddHostedService<OccDataSeeder>();

// Health checks
builder.Services.AddHealthChecks()
    .AddCheck<DeepHealthCheck>("deep");

builder.Services.AddScoped<DeepHealthCheck>();

// Estado en memoria del handshake del frontend (habilita E4)
builder.Services.AddSingleton<FrontendHandshakeState>();

// Controllers
builder.Services.AddControllers()
    .AddJsonOptions(opts =>
    {
        opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        opts.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

builder.Services.AddEndpointsApiExplorer();

// Swagger / OpenAPI — habilitado en todos los entornos, la API es interna
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Copa OCC API",
        Version = "v1",
        Description = "Plataforma de monitoreo del Centro de Control de Operaciones"
    });

    // /health y /health/deep no los ve ApiExplorer; se documentan a mano
    options.DocumentFilter<Copa.OCC.Api.Presentation.Swagger.HealthChecksDocumentFilter>();
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Copa OCC API v1");
    options.DocumentTitle = "Copa OCC API";
});

app.UseMiddleware<CorrelationIdMiddleware>();

app.UseSerilogRequestLogging();

// UseRouting debe ir antes de UseCors para que RequireCors por endpoint tenga efecto
app.UseRouting();
app.UseCors("OccCorsPolicy");

app.UseMiddleware<FrontendHandshakeMiddleware>();

app.UseAuthorization();
app.MapControllers();

// Probe endpoint de conectividad — CORS abierto intencionalmente
app.MapGet("/api/diagnostics/probe", () => Results.Ok(new { probe = true }))
    .RequireCors("ProbePolicy")
    .ExcludeFromDescription();

// Health endpoints
app.MapHealthChecks("/health", new HealthCheckOptions
{
    Predicate = _ => false,
    ResponseWriter = async (ctx, _) =>
    {
        ctx.Response.ContentType = "application/json";
        await ctx.Response.WriteAsync(JsonSerializer.Serialize(new { status = "Healthy" }));
    }
});

app.MapHealthChecks("/health/deep", new HealthCheckOptions
{
    Predicate = hc => hc.Name == "deep",
    ResultStatusCodes =
    {
        [HealthStatus.Healthy] = StatusCodes.Status200OK,
        [HealthStatus.Degraded] = StatusCodes.Status503ServiceUnavailable,
        [HealthStatus.Unhealthy] = StatusCodes.Status503ServiceUnavailable
    },
    ResponseWriter = async (ctx, report) =>
    {
        ctx.Response.ContentType = "application/json";
        var entry = report.Entries.FirstOrDefault().Value;
        var result = new
        {
            status = report.Status.ToString(),
            mode = entry.Data.GetValueOrDefault("mode", "unknown"),
            errorCode = entry.Data.GetValueOrDefault("errorCode", null),
            reason = entry.Data.GetValueOrDefault("reason", null),
            checks = report.Entries.Select(e => new { name = e.Key, status = e.Value.Status.ToString() })
        };
        await ctx.Response.WriteAsync(JsonSerializer.Serialize(result));
    }
});

await app.RunAsync();
