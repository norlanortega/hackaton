using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Copa.OCC.Api.Presentation.Swagger;

/// <summary>
/// MapHealthChecks no expone metadatos a ApiExplorer, asi que /health/deep
/// no aparece en el documento OpenAPI. Este filtro lo agrega a mano.
/// </summary>
public class HealthChecksDocumentFilter : IDocumentFilter
{
    public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
    {
        var operation = new OpenApiOperation
        {
            Summary = "Deep health check",
            Description = "Verifica el estado profundo del servicio y sus dependencias.",
            Tags = new HashSet<OpenApiTagReference> { new("Health") },
            Responses = new OpenApiResponses
            {
                ["200"] = new OpenApiResponse { Description = "Todas las verificaciones pasaron." },
                ["503"] = new OpenApiResponse
                {
                    Description = "El estado es Degraded o Unhealthy. El cuerpo incluye errorCode."
                }
            }
        };

        swaggerDoc.Paths.Add("/health/deep", new OpenApiPathItem
        {
            Operations = new Dictionary<HttpMethod, OpenApiOperation> { [HttpMethod.Get] = operation }
        });
    }
}
