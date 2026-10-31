import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from './App';
import { initTelemetry } from './core/telemetry/app-insights';
import './styles.css';

const InformationDashboard = lazy(() => import('./features/information-monitoring/InformationDashboard'));
const HealthDashboard = lazy(() => import('./features/service-health/HealthDashboard'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/information" replace /> },
      { path: 'information', element: <Suspense fallback={null}><InformationDashboard /></Suspense> },
      { path: 'health',  element: <Suspense fallback={null}><HealthDashboard /></Suspense> }
    ]
  }
]);

void initTelemetry();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
