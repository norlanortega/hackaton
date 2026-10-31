import type { Environment } from './environment';

export const environment: Environment = {
  production: true,
  apiBaseUrl: 'https://api.occ.copa.com',
  services: {
    INFORMATION_ENDPOINT_URL: '/api/information',
    SERVICE_ENDPOINT_URLX: '/api/services'
  }
};
