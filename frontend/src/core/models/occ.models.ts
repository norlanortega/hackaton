export type FlightStatus = 'Scheduled' | 'InTransit' | 'Delayed' | 'Cancelled' | 'Landed';

export interface Flight {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  scheduledDeparture: string;
  estimatedDeparture: string;
  status: FlightStatus;
  statusLabel: string;
  diverted: boolean;
  isAlert: boolean;
}

export type ServiceAvailability = 'Available' | 'Degraded' | 'Unavailable';

export interface ServiceStatus {
  id: string;
  name: string;
  description: string;
  availability: ServiceAvailability;
  availabilityLabel: string;
  lastChecked: string;
}

export interface HealthStatus {
  status: string;
  mode?: string;
  errorCode?: string;
  checks?: Array<{ name: string; status: string }>;
}

export interface ApiStatus {
  available: boolean;
  timestamp?: string;
  message?: string;
}
