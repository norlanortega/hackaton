import { useState, useEffect, useMemo } from 'react';
import { getInformation } from '../../core/services/information.service';
import { Flight } from '../../core/models/occ.models';
import InformationList from './InformationList';
import InformationFilter, { InformationFilters } from './InformationFilter';

const POLL_MS = 30_000;

export default function InformationDashboard() {
  const [allInformation, setAllInformation] = useState<Flight[]>([]);
  const [filters, setFilters]       = useState<InformationFilters>({ route: '', status: '', date: '' });
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getInformation()
      .then(f => { if (!cancelled) { setAllInformation(f); setLoading(false); } })
      .catch((e: Error) => { if (!cancelled) { setError(e.message); setLoading(false); } });

    const poll = setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      getInformation()
        .then(f => { if (!cancelled) { setAllInformation(f); setError(null); } })
        .catch(() => {});
    }, POLL_MS);

    return () => { cancelled = true; clearInterval(poll); };
  }, []);

  const filteredInformation = useMemo(() => allInformation.filter(flight => {
    const routeMatch = !filters.route ||
      flight.origin.toLowerCase().includes(filters.route.toLowerCase()) ||
      flight.destination.toLowerCase().includes(filters.route.toLowerCase());
    const statusMatch = !filters.status || flight.status === filters.status;
    const dateMatch   = !filters.date   || flight.scheduledDeparture.startsWith(filters.date);
    return routeMatch && statusMatch && dateMatch;
  }), [allInformation, filters]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: '1.625rem', color: '#0434A4', letterSpacing: '-0.02em', margin: '0 0 4px' }}>
            Monitoreo de Vuelos
          </h1>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '0.8125rem', color: '#64748B', margin: 0 }}>
            Estado operativo en tiempo real · actualización cada 30 s
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 20 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: '0.75rem', fontWeight: 500, color: '#16A34A' }}>En vivo</span>
        </div>
      </div>

      <InformationFilter onFiltersChange={setFilters} />

      {loading ? (
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: '64px 24px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 12, color: '#94A3B8' }}>
            <div style={{ width: 32, height: 32, border: '3px solid #E2E8F0', borderTopColor: '#0434A4', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: '0.875rem' }}>Cargando vuelos…</span>
          </div>
        </div>
      ) : error ? (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '16px 20px', fontFamily: "'Inter',sans-serif", fontSize: '0.875rem', color: '#991B1B' }}>
          Error al cargar vuelos: {error}
        </div>
      ) : (
        <>
          <div style={{ padding: '0 2px' }}>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: '0.8125rem', fontWeight: 600, color: '#475569' }}>
              {filteredInformation.length} vuelo(s) encontrados
            </span>
          </div>
          <InformationList items={filteredInformation} />
        </>
      )}

    </div>
  );
}
