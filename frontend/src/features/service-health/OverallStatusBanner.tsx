import { ServiceStatus } from '../../core/models/occ.models';

interface Props { services: ServiceStatus[] }

export default function OverallStatusBanner({ services }: Props) {
  if (services.length === 0) return null;

  const countBy = (s: string) => services.filter(x => x.availability === s).length;
  const hasUnavailable = services.some(s => s.availability === 'Unavailable');
  const hasDegraded    = services.some(s => s.availability === 'Degraded');

  if (hasUnavailable) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderRadius: 10, background: '#FEF2F2', border: '1.5px solid #FECACA' }}>
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444', flexShrink: 0, boxShadow: '0 0 0 3px rgba(239,68,68,0.2)' }}></span>
      <div>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: '0.9375rem', fontWeight: 700, color: '#991B1B', margin: 0 }}>Falla de servicio detectada</p>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '0.8125rem', color: '#B91C1C', marginTop: 1 }}>
          {countBy('Unavailable')} servicio(s) no disponible(s) — revisión inmediata requerida
        </p>
      </div>
    </div>
  );

  if (hasDegraded) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderRadius: 10, background: '#FFFBEB', border: '1.5px solid #FDE68A' }}>
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B', flexShrink: 0, boxShadow: '0 0 0 3px rgba(245,158,11,0.2)' }}></span>
      <div>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: '0.9375rem', fontWeight: 700, color: '#92400E', margin: 0 }}>Degradación detectada</p>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '0.8125rem', color: '#B45309', marginTop: 1 }}>
          {countBy('Degraded')} servicio(s) operando de forma degradada
        </p>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderRadius: 10, background: '#F0FDF4', border: '1.5px solid #BBF7D0' }}>
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22C55E', flexShrink: 0, boxShadow: '0 0 0 3px rgba(34,197,94,0.2)' }}></span>
      <div>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: '0.9375rem', fontWeight: 700, color: '#14532D', margin: 0 }}>Todos los servicios operativos</p>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '0.8125rem', color: '#166534', marginTop: 1 }}>
          {services.length} servicios verificados sin incidencias
        </p>
      </div>
    </div>
  );
}
