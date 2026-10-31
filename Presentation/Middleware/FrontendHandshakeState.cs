namespace Copa.OCC.Api.Presentation.Middleware;

/// <summary>
/// Registra que el frontend consumio correctamente los servicios de informacion y de estado.
/// El estado vive en memoria: se reinicia junto con la aplicacion.
/// </summary>
public class FrontendHandshakeState
{
    private volatile bool informationSeen;
    private volatile bool servicesSeen;

    public bool IsVerified => informationSeen && servicesSeen;

    public void MarkInformation() => informationSeen = true;

    public void MarkServices() => servicesSeen = true;
}
