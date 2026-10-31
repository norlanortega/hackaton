import { useState, useEffect } from 'react';
import { getServices } from '../../core/services/health.service';
import { ServiceStatus } from '../../core/models/occ.models';
import ServiceStatusCard from './ServiceStatusCard';
import OverallStatusBanner from './OverallStatusBanner';

const POLL_MS = 30_000;

export default function HealthDashboard() {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getServices()
      .then(s => { if (!cancelled) { setServices(s); setLoading(false); } })
      .catch((e: Error) => { if (!cancelled) { setError(e.message); setLoading(false); } });

    const poll = setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      getServices()
        .then(s => { if (!cancelled) { setServices(s); setError(null); } })
        .catch(() => {});
    }, POLL_MS);

    return () => { cancelled = true; clearInterval(poll); };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: '1.5rem', color: '#0434A4', letterSpacing: '-0.01em', margin: 0 }}>
            Panel de Salud de Servicios
          </h1>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '0.875rem', color: '#64748B', marginTop: 2 }}>
            Disponibilidad operativa de servicios de soporte · actualización cada 30 s
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94A3B8', fontFamily: "'Inter',sans-serif", fontSize: '0.75rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ADE80', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
          En vivo
        </div>
      </div>

      <OverallStatusBanner services={services} />

      {loading ? (
        <div className="copa-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '64px 0', color: '#94A3B8', fontFamily: "'Inter',sans-serif" }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, border: '2px solid #0434A4', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
            <span style={{ fontSize: '0.875rem' }}>Verificando servicios…</span>
          </div>
        </div>
      ) : error ? (
        <div className="copa-card" style={{ padding: 16, background: '#FEF2F2', borderColor: '#FECACA', color: '#B91C1C', fontSize: '0.875rem', fontFamily: "'Inter',sans-serif" }}>
          Error al cargar servicios: {error}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {services.map(svc => <ServiceStatusCard key={svc.id} service={svc} />)}
        </div>
      )}

    </div>
  );
}
