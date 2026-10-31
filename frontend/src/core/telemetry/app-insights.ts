import { ApplicationInsights, SeverityLevel } from '@microsoft/applicationinsights-web';

let appInsights: ApplicationInsights | null = null;

// Los errores detectados antes de que termine la inicializacion se encolan aqui
const pending: Array<() => void> = [];

/**
 * La cadena de conexion la sirve el servidor Node en /config.json a partir de
 * APPLICATIONINSIGHTS_CONNECTION_STRING. Si no hay cadena, la app funciona sin telemetria.
 */
export async function initTelemetry(): Promise<void> {
  try {
    const response = await fetch('/config.json', { cache: 'no-store' });
    if (!response.ok) return;

    const { appInsightsConnectionString } = await response.json() as {
      appInsightsConnectionString?: string;
    };
    if (!appInsightsConnectionString) return;

    appInsights = new ApplicationInsights({
      config: {
        connectionString: appInsightsConnectionString,
        enableAutoRouteTracking: true,
        enableUnhandledPromiseRejectionTracking: true
      }
    });
    // El SDK antepone el tipo al mensaje cuando no es "Error"; se reescribe el envelope
    // para dejar el mensaje intacto y aun asi mostrar un Exception type propio.
    appInsights.addTelemetryInitializer(envelope => {
      const data = envelope.baseData;
      if (envelope.baseType !== 'ExceptionData' || !data) return;

      const errorType = data.properties?.['ErrorType'];
      if (errorType && data.exceptions?.length) {
        const exception = data.exceptions[0];
        exception.typeName = errorType;

        // Azure deriva el "Exception type" que muestra el portal de la primera
        // linea del stack, no de typeName; se reescribe solo esa linea.
        if (typeof exception.stack === 'string') {
          exception.stack = exception.stack.replace(/^Error:/, `${errorType}:`);
        }

        data.properties['typeName'] = errorType;
        delete data.properties['ErrorType'];
      }
    });

    appInsights.loadAppInsights();
    appInsights.trackPageView();

    pending.splice(0).forEach(emit => emit());
  } catch {
    // Sin telemetria la aplicacion debe seguir operando con normalidad
  }
}

export function trackErrorCode(errorCode: string, message: string, typeName?: string): void {
  const emit = () => {
    const properties: Record<string, string> = { ErrorCode: errorCode };
    if (typeName) properties['ErrorType'] = typeName;

    appInsights?.trackException({
      exception: new Error(`${errorCode}: ${message}`),
      severityLevel: SeverityLevel.Error,
      properties
    });
  };

  if (appInsights) emit();
  else pending.push(emit);
}
