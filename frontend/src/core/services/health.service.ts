import { apiFetch, resolveEndpoint } from '../http/api-client';
import { ServiceStatus, HealthStatus, ApiStatus } from '../models/occ.models';

export function getServices(): Promise<ServiceStatus[]> {
  const url = resolveEndpoint('SERVICE_ENDPOINT_URL');
  if (!url) return Promise.reject(new Error('Error E3'));

  return apiFetch<ServiceStatus[]>(url, undefined, 'E3');
}
export const getHealth    = () => apiFetch<HealthStatus>('/health');
export const getDeepHealth = () => apiFetch<HealthStatus>('/health/deep');
export const getStatus    = () => apiFetch<ApiStatus>('/api/status');
