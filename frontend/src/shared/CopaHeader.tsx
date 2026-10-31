import { NavLink } from 'react-router-dom';

const NAV_BASE: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '6px 14px', borderRadius: 8,
  fontFamily: "'Outfit',sans-serif", fontSize: '0.875rem', fontWeight: 500,
  color: 'rgba(255,255,255,0.88)', textDecoration: 'none', transition: 'background 150ms'
};

export default function CopaHeader() {
  return (
    <header style={{ background: '#0434A4', boxShadow: '0 2px 8px rgba(4,52,164,0.35)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: '1.0625rem', color: '#fff', letterSpacing: '-0.01em' }}>Copa Airlines</span>
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: '0.625rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)' }}>Operations Control Center</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <NavLink to="/information" style={({ isActive }) => ({ ...NAV_BASE, background: isActive ? 'rgba(255,255,255,0.18)' : undefined, fontWeight: isActive ? 600 : 500, color: isActive ? '#fff' : 'rgba(255,255,255,0.88)' })}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
            Vuelos
          </NavLink>
          <NavLink to="/health" style={({ isActive }) => ({ ...NAV_BASE, background: isActive ? 'rgba(255,255,255,0.18)' : undefined, fontWeight: isActive ? 600 : 500, color: isActive ? '#fff' : 'rgba(255,255,255,0.88)' })}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            Servicios
          </NavLink>
        </nav>

      </div>
    </header>
  );
}
