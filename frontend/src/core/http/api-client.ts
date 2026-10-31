import { environment } from '../../environments/environment';
import { trackErrorCode } from '../telemetry/app-insights';

// Tipo que Application Insights muestra como "Exception type" para cada error
export const ERROR_TYPES: Record<string, string> = {
  E1: 'Connection Refused',
  E2: 'strict-origin-when-cross-origin',
  E3: 'BadRequest'
};

// Probe mode:cors: distingue backend inalcanzable de respuesta bloqueada por el navegador
async function classifyNetworkError(): Promise<never> {
  try {
    const r = await fetch(
      `${environment.apiBaseUrl}/api/diagnostics/probe?_t=${Date.now()}`,
      { mode: 'cors', cache: 'no-store', signal: AbortSignal.timeout(2000) }
    );
    throw new Error(r.ok ? 'Error E2' : 'Error E1');
  } catch (e: unknown) {
    const err = e instanceof Error ? e : new Error('Error E1');
    const failure = err.message.startsWith('Error E') ? err : new Error('Error E1');
    const code = failure.message.replace('Error ', '');
    trackErrorCode(
      code,
      code === 'E2'
        ? 'El backend responde pero el navegador bloqueo la respuesta (CORS)'
        : 'No se pudo alcanzar el backend en ' + environment.apiBaseUrl,
      ERROR_TYPES[code]
    );
    throw failure;
  }
}

/**
 * Resuelve la ruta de un servicio desde la configuracion.
 * Si la clave no existe, reporta E3 y devuelve null.
 */
export function resolveEndpoint(key: string): string | null {
  const url = environment.services[key];
  if (url) return url;

  trackErrorCode('E3', `No hay ruta configurada para ${key}`, ERROR_TYPES['E3']);
  return null;
}

export async function apiFetch<T>(
  path: string,
  params?: Record<string, string>,
  notFoundErrorCode?: string
): Promise<T> {
  const url = new URL(`${environment.apiBaseUrl}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => { if (v) url.searchParams.set(k, v); });
  }

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      headers: { 'X-Correlation-Id': crypto.randomUUID() }
    });
  } catch {
    return classifyNetworkError() as never;
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as Record<string, unknown>;
    // Surfacea errorCode del backend directamente en el mensaje
    if (body?.errorCode) {
      const code = body.errorCode as string;
      trackErrorCode(code, `${url.pathname} respondio HTTP ${response.status}`, ERROR_TYPES[code]);
      throw new Error((body.message as string) ?? `Error ${code}`);
    }
    if (response.status === 404 && notFoundErrorCode) {
      trackErrorCode(notFoundErrorCode, `La ruta ${url.pathname} no existe en el backend`, ERROR_TYPES[notFoundErrorCode]);
      throw new Error(`Error ${notFoundErrorCode}`);
    }

    throw new Error(`HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}
