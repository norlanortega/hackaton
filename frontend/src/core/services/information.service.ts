import { apiFetch, resolveEndpoint } from '../http/api-client';
import { Flight, FlightStatus } from '../models/occ.models';

export interface InformationFilters {
  origin?: string;
  destination?: string;
  status?: FlightStatus | '';
  date?: string;
}

export function getInformation(filters?: InformationFilters): Promise<Flight[]> {
  const params: Record<string, string> = {};
  if (filters?.origin) params['origin'] = filters.origin;
  if (filters?.destination) params['destination'] = filters.destination;
  if (filters?.status) params['status'] = filters.status;
  if (filters?.date) params['date'] = filters.date;
  const url = resolveEndpoint('INFORMATION_ENDPOINT_URL');
  if (!url) return Promise.reject(new Error('Error E3'));

  return apiFetch<Flight[]>(url, params, 'E3');
}
