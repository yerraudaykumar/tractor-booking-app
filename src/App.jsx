import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Tractor, User, Settings, MapPin, History } from 'lucide-react';
import FarmerDashboard from './pages/FarmerDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import Login from './pages/Login';
import EquipmentMap from './pages/EquipmentMap';
import BookingHistory from './pages/BookingHistory';
import BookingHistory from './pages/BookingHistory';
// import TrackVehicle from './pages/TrackVehicle';

const navLinkStyle = ({ isActive }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.5rem 1rem',
  borderRadius: 'var(--radius-sm)',
  textDecoration: 'none',
  fontSize: '0.875rem',
  fontWeight: isActive ? '700' : '500',
  background: isActive ? 'var(--primary-color)' : 'transparent',
  color: isActive ? 'white' : 'var(--text-main)',
  border: isActive ? '1px solid var(--primary-color)' : '1px solid var(--border-color)',
  transition: 'background 0.2s, color 0.2s, border-color 0.2s',
});

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <nav className="navbar">
          <NavLink to="/" className="brand-logo" style={{ textDecoration: 'none' }}>
            <Tractor size={26} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontSize: '1.25rem' }}>HarvesterHub</span>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--secondary-color)', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>by yerraudaykumar</span>
            </div>
          </NavLink>
          <div className="flex gap-sm" style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <NavLink to="/map" style={navLinkStyle}><MapPin size={16} /> Map</NavLink>
            <NavLink to="/history" style={navLinkStyle}><History size={16} /> Bookings</NavLink>
            <NavLink to="/history" style={navLinkStyle}><History size={16} /> Bookings</NavLink>
            <NavLink to="/farmer" style={navLinkStyle}><User size={16} /> Farmer</NavLink>
            <NavLink to="/owner" style={navLinkStyle}><Settings size={16} /> Owner</NavLink>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/farmer/*" element={<FarmerDashboard />} />
            <Route path="/owner/*" element={<OwnerDashboard />} />
            <Route path="/map" element={<EquipmentMap />} />
            <Route path="/history" element={<BookingHistory />} />
            <Route path="/history" element={<BookingHistory />} />
            {/* <Route path="/track" element={<TrackVehicle />} /> */}
          </Routes>
        </main>
        <footer style={{ padding: '2rem 1rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          <p>© 2026 HarvesterHub • Developed with ❤️ by <strong>yerraudaykumar</strong></p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;

