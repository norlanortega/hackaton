import { ServiceStatus, ServiceAvailability } from '../../core/models/occ.models';

const AVAIL_CONFIG: Record<ServiceAvailability, { label: string; bg: string; color: string; dot: string; border: string }> = {
  Available:   { label: 'Disponible',    bg: '#F0FDF4', color: '#14532D', dot: '#22C55E', border: '#BBF7D0' },
  Degraded:    { label: 'Degradado',     bg: '#FFFBEB', color: '#92400E', dot: '#F59E0B', border: '#FDE68A' },
  Unavailable: { label: 'No disponible', bg: '#FEF2F2', color: '#991B1B', dot: '#EF4444', border: '#FECACA' }
};

function fmtDate(iso: string): string {
  const d = new Date(iso);
  const day   = d.getDate().toString().padStart(2, '0');
  const month = d.toLocaleString('es-PA', { month: 'short' });
  const time  = d.toLocaleTimeString('es-PA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  return `${day} ${month}, ${time}`;
}

interface Props { service: ServiceStatus }

export default function ServiceStatusCard({ service }: Props) {
  const cfg = AVAIL_CONFIG[service.availability] ?? AVAIL_CONFIG['Unavailable'];
  return (
    <div className="copa-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: '0.9375rem', fontWeight: 600, color: '#1E293B', lineHeight: 1.3, margin: 0 }}>
            {service.name}
          </p>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '0.8125rem', color: '#64748B', marginTop: 2, lineHeight: 1.4 }}>
            {service.description}
          </p>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 9999, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontFamily: "'Outfit',sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.02em', whiteSpace: 'nowrap', flexShrink: 0 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }}></span>
          {cfg.label}
        </span>
      </div>
      <p style={{ fontFamily: "'Inter',sans-serif", fontSize: '0.75rem', color: '#94A3B8', borderTop: '1px solid #F1F5F9', paddingTop: 10, margin: 0 }}>
        Verificado: {fmtDate(service.lastChecked)}
      </p>
    </div>
  );
}
