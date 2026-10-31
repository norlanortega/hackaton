import { FlightStatus } from '../../core/models/occ.models';

/* WCAG AA verified: all combos ≥ 4.5:1 contrast ratio */
const STATUS_CONFIG: Record<FlightStatus, { label: string; bg: string; color: string }> = {
  Scheduled: { label: 'Programado',  bg: '#F1F5F9', color: '#334155' },
  InTransit: { label: 'En tránsito', bg: '#EEF2FF', color: '#1E3A8A' },
  Delayed:   { label: 'Retrasado',   bg: '#FFFBEB', color: '#92400E' },
  Cancelled: { label: 'Cancelado',   bg: '#FEF2F2', color: '#991B1B' },
  Landed:    { label: 'Aterrizado',  bg: '#F0FDF4', color: '#14532D' }
};

interface Props {
  status: FlightStatus;
  diverted?: boolean;
}

export default function InformationStatusBadge({ status, diverted = false }: Props) {
  const { label, bg, color } = STATUS_CONFIG[status];
  return (
    <>
      <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 10px', borderRadius: 9999, background: bg, color, fontFamily: "'Outfit',sans-serif", fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.02em' }}>
        {label}
      </span>
      {diverted && (
        <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 4, padding: '2px 10px', borderRadius: 9999, background: '#FFF7ED', color: '#9A3412', fontFamily: "'Outfit',sans-serif", fontSize: '0.75rem', fontWeight: 600 }}>
          Desviado
        </span>
      )}
    </>
  );
}
