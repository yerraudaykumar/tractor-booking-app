import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Tractor, User, Settings, MapPin, History, RefreshCcw, MessageCircle } from 'lucide-react';
import FarmerDashboard from './pages/FarmerDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import Login from './pages/Login';
import EquipmentMap from './pages/EquipmentMap';
import BookingHistory from './pages/BookingHistory';
import BookingHistory from './pages/BookingHistory';
// import TrackVehicle from './pages/TrackVehicle';
import Chat from './pages/Chat';

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
  const [isLoding, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Initial Splash Screen
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  if (isLoding) {
    return (
      <div className="splash-screen">
        <div className="splash-logo">
          <Tractor size={120} color="var(--primary-color)" />
        </div>
        <h1 className="splash-text">FARMSETU</h1>
        <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Connecting Agriculture...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {isRefreshing && (
        <div className="refresh-overlay">
          <div className="tractor-loader">
            <Tractor size={80} color="var(--primary-color)" />
            <p style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--primary-color)', marginTop: '1rem' }}>Syncing Farm Data...</p>
          </div>
        </div>
      )}
      <div className="app-wrapper">
        <nav className="navbar">
          <NavLink to="/" className="brand-logo" style={{ textDecoration: 'none' }}>
            <Tractor size={26} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontSize: '1.25rem' }}>FarmSetu</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--secondary-color)' }}>by yerraudaykumar</span>
                <span style={{ border: '1px solid #4caf50', color: '#4caf50', fontSize: '0.55rem', padding: '1px 4px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: '900' }}>🛡️ Firewall Active</span>
              </div>
            </div>
          </NavLink>
          <div className="flex gap-sm" style={{ flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'center' }}>
            <button
              onClick={handleRefresh}
              className="btn btn-outline"
              style={{ padding: '0.4rem', borderRadius: '50%', width: '36px', height: '36px', border: '1px solid var(--border-color)' }}
              title="Refresh Data"
            >
              <RefreshCcw size={16} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
            </button>
            <NavLink to="/map" style={navLinkStyle}><MapPin size={16} /> Map</NavLink>
            <NavLink to="/history" style={navLinkStyle}><History size={16} /> Bookings</NavLink>
            <NavLink to="/history" style={navLinkStyle}><History size={16} /> Bookings</NavLink>
            <NavLink to="/chat" style={navLinkStyle}>
              <div style={{ position: 'relative' }}>
                <MessageCircle size={16} />
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', background: 'var(--danger-color)', borderRadius: '50%', border: '1.5px solid white' }}></span>
              </div>
              Chat
            </NavLink>
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
            <Route path="/chat" element={<Chat />} />
            {/* <Route path="/track" element={<TrackVehicle />} /> */}
          </Routes>
        </main>
        <footer style={{ padding: '3rem 1rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', marginTop: '2rem', background: 'white' }}>
          <p style={{ margin: 0, fontWeight: '700', color: 'var(--text-main)', fontSize: '1.1rem' }}>Developed with ❤️ by yerraudaykumar</p>
          <div className="flex justify-center gap-md" style={{ marginTop: '1rem', flexWrap: 'wrap' }}>
            <a href="https://github.com/yerraudaykumar/tractor-booking-app" target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
              📦 Repository
            </a>
            <span style={{ color: '#ccc' }}>|</span>
            <span style={{ fontSize: '0.85rem', color: '#2e7d32', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              🛡️ Firewall Protected
            </span>
            <span style={{ color: '#ccc' }}>|</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              ⚡ Vercel Optimized
            </span>
          </div>
          <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#999' }}>© 2026 FarmSetu Professional Enterprise Edition</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;

