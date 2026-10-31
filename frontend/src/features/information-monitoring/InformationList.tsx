import { Flight } from '../../core/models/occ.models';
import InformationStatusBadge from './InformationStatusBadge';

function fmtDate(iso: string, includeDate = true): string {
  const d = new Date(iso);
  const time = d.toLocaleTimeString('es-PA', { hour: '2-digit', minute: '2-digit' });
  if (!includeDate) return time;
  const day = d.getDate().toString().padStart(2, '0');
  const month = d.toLocaleString('es-PA', { month: 'short' });
  return `${day} ${month} · ${time}`;
}

const COLUMNS = ['Vuelo', 'Origen', 'Destino', 'Hora Prog.', 'Hora Est.', 'Estado'];

interface Props { items: Flight[] }

export default function InformationList({ items }: Props) {
  return (
    <div style={{ border: '1px solid #E2E8F0', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 4px rgba(4,52,164,0.06)', width: '100%' }}>
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#0434A4' }}>
              {COLUMNS.map(col => (
                <th key={col} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: "'Outfit',sans-serif", fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)' }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '48px 16px', textAlign: 'center', fontFamily: "'Inter',sans-serif", fontSize: '0.875rem', color: '#94A3B8' }}>
                  Sin vuelos para los filtros seleccionados
                </td>
              </tr>
            ) : items.map((flight, i) => {
              const bg = flight.status === 'Cancelled' ? '#FEF9F9'
                       : flight.status === 'Delayed'   ? '#FFFDF0'
                       : i % 2 === 0 ? '#fff' : '#FAFBFF';
              return (
                <tr key={flight.id} style={{ background: bg, borderBottom: '1px solid #EEF2FF', transition: 'background 120ms' }}>
                  <td style={{ padding: '12px 16px', fontFamily: "'Outfit',sans-serif", fontSize: '0.875rem', fontWeight: 600, color: '#0434A4' }}>
                    {flight.flightNumber}
                    {flight.isAlert && <span style={{ marginLeft: 6, color: '#DC2626' }} aria-label="Alerta crítica">⚠</span>}
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: "'Inter',sans-serif", fontSize: '0.875rem', color: '#334155' }}>{flight.origin}</td>
                  <td style={{ padding: '12px 16px', fontFamily: "'Inter',sans-serif", fontSize: '0.875rem', color: '#334155' }}>{flight.destination}</td>
                  <td style={{ padding: '12px 16px', fontFamily: "'Inter',sans-serif", fontSize: '0.875rem', color: '#475569' }}>{fmtDate(flight.scheduledDeparture)}</td>
                  <td style={{ padding: '12px 16px', fontFamily: "'Inter',sans-serif", fontSize: '0.875rem', color: '#475569' }}>{fmtDate(flight.estimatedDeparture, false)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <InformationStatusBadge status={flight.status} diverted={flight.diverted} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
