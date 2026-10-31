export interface Environment {
  production: boolean;
  apiBaseUrl: string;
  services: Record<string, string | undefined>;
}

export const environment: Environment = {
  production: false,
  apiBaseUrl: 'http://localhost:5200',
  services: {
    INFORMATION_ENDPOINT_URL: '/api/information',
    SERVICE_ENDPOINT_URLX: '/api/services'
  }
};
