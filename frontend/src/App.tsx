import { Outlet } from 'react-router-dom';
import CopaHeader from './shared/CopaHeader';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF' }}>
      <CopaHeader />
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 24px' }}>
        <Outlet />
      </main>
    </div>
  );
}
