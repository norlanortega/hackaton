import { useState } from 'react';
import { FlightStatus } from '../../core/models/occ.models';

export interface InformationFilters {
  route: string;
  status: FlightStatus | '';
  date: string;
}

const INPUT: React.CSSProperties = {
  height: 36, padding: '0 10px', border: '1.5px solid #CBD5E1', borderRadius: 6,
  fontFamily: "'Inter',sans-serif", fontSize: '0.875rem', color: '#1E3A5F',
  background: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box'
};

const LABEL: React.CSSProperties = {
  fontFamily: "'Inter',sans-serif", fontSize: '0.6875rem', fontWeight: 600,
  letterSpacing: '0.07em', textTransform: 'uppercase', color: '#64748B',
  marginBottom: 4, display: 'block'
};

const STATUSES: Array<{ value: FlightStatus; label: string }> = [
  { value: 'Scheduled', label: 'Programado' },
  { value: 'InTransit', label: 'En tránsito' },
  { value: 'Delayed',   label: 'Retrasado' },
  { value: 'Cancelled', label: 'Cancelado' },
  { value: 'Landed',    label: 'Aterrizado' }
];

interface Props {
  onFiltersChange: (f: InformationFilters) => void;
}

export default function InformationFilter({ onFiltersChange }: Props) {
  const [route, setRoute]   = useState('');
  const [status, setStatus] = useState<FlightStatus | ''>('');
  const [date, setDate]     = useState('');

  function emit(r: string, s: FlightStatus | '', d: string) {
    onFiltersChange({ route: r, status: s, date: d });
  }

  function clear() {
    setRoute(''); setStatus(''); setDate('');
    onFiltersChange({ route: '', status: '', date: '' });
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: '16px 20px', boxShadow: '0 1px 4px rgba(4,52,164,0.06)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 160 }}>
          <label style={LABEL}>Ruta (origen / destino)</label>
          <input type="text" value={route}
            onChange={e => { setRoute(e.target.value); emit(e.target.value, status, date); }}
            placeholder="Ej. PTY, BOG…" style={INPUT} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={LABEL}>Estado</label>
          <select value={status}
            onChange={e => { const v = e.target.value as FlightStatus | ''; setStatus(v); emit(route, v, date); }}
            style={{ ...INPUT, minWidth: 148 }}>
            <option value="">Todos los estados</option>
            {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={LABEL}>Fecha</label>
          <input type="date" value={date}
            onChange={e => { setDate(e.target.value); emit(route, status, e.target.value); }}
            style={{ ...INPUT, minWidth: 148 }} />
        </div>

        <button type="button" onClick={clear}
          style={{ height: 36, padding: '0 18px', background: '#0434A4', color: '#fff', border: 'none', borderRadius: 6, fontFamily: "'Outfit',sans-serif", fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', alignSelf: 'flex-end' }}>
          Limpiar filtros
        </button>

      </div>
    </div>
  );
}
