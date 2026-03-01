import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Tractor } from 'lucide-react';

const equipmentData = [
    { id: 1, type: "Tractor", name: "Mahindra 575 DI", owner: "Ramesh K.", phone: "9848012345", priceAcre: 1000, offset: { lat: 0.012, lng: -0.018 }, image: "https://images.unsplash.com/photo-1594488311306-029da6396e95?auto=format&fit=crop&q=80&w=400" },
    { id: 2, type: "Tractor", name: "Swaraj 744 FE", owner: "Suresh P.", phone: "9849123456", priceAcre: 1100, offset: { lat: -0.008, lng: 0.022 }, image: "https://images.unsplash.com/photo-1594488311210-9097746bc560?auto=format&fit=crop&q=80&w=400" },
    { id: 3, type: "Paddy Harvester", name: "Preet 987", owner: "Vijay S.", phone: "9100023456", priceAcre: 2800, offset: { lat: 0.025, lng: 0.015 }, image: "https://images.unsplash.com/photo-1599557929452-3fb86e680a31?auto=format&fit=crop&q=80&w=400" },
    { id: 4, type: "Maize Harvester", name: "Kartar 4000", owner: "Reddy Farms", phone: "9701234567", priceAcre: 3500, offset: { lat: -0.030, lng: -0.010 }, image: "https://images.unsplash.com/photo-1599557929419-f55e090f7d49?auto=format&fit=crop&q=80&w=400" },
    { id: 5, type: "Sprayer", name: "Boom Sprayer 600L", owner: "Prakash N.", phone: "9550012345", priceAcre: 800, offset: { lat: 0.005, lng: 0.030 }, image: "https://images.unsplash.com/photo-1594488311252-0fb3264426d5?auto=format&fit=crop&q=80&w=400" },
    { id: 6, type: "Seed Drill", name: "Happy Seeder 9-Row", owner: "Mohan Rao", phone: "9440123456", priceAcre: 1200, offset: { lat: -0.018, lng: 0.008 }, image: "https://images.unsplash.com/photo-1592834306352-7f28dc07da25?auto=format&fit=crop&q=80&w=400" },
    { id: 7, type: "Rotavator", name: "Fieldking Rotavator", owner: "Srinivas K.", phone: "9866012345", priceAcre: 600, offset: { lat: 0.020, lng: -0.025 }, image: "https://images.unsplash.com/photo-1594488311138-09746bc56081?auto=format&fit=crop&q=80&w=400" },
];

const typeColors = { "Tractor": "#2e7d32", "Paddy Harvester": "#e65100", "Maize Harvester": "#f9a825", "Sprayer": "#1565c0", "Seed Drill": "#6a1b9a", "Rotavator": "#00695c" };
const typeEmoji = { "Tractor": "🚜", "Paddy Harvester": "🌾", "Maize Harvester": "🌽", "Sprayer": "💧", "Seed Drill": "🌱", "Rotavator": "⚙️" };

async function reverseGeocode(lat, lng) {
    try {
        const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
        const d = await r.json();
        return d.address?.village || d.address?.suburb || d.address?.city || d.address?.town || 'your area';
    } catch { return 'your area'; }
}

export default function EquipmentMap() {
    const [selected, setSelected] = useState(null);
    const [filterType, setFilterType] = useState('All');
    const [userLocation, setUserLocation] = useState(null);
    const [locationName, setLocationName] = useState('');
    const [geoStatus, setGeoStatus] = useState('requesting'); // 'requesting' | 'granted' | 'denied'
    const mapRef = useRef(null);
    const markerRefs = useRef({});
    const userMarkerRef = useRef(null);
    const types = ['All', ...Object.keys(typeColors)];

    const buildMap = (center) => {
        const L = window.L;
        if (document.getElementById('equipment-map')?._leaflet_id) return;

        mapRef.current = L.map('equipment-map').setView([center.lat, center.lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
        }).addTo(mapRef.current);

        // Real user position marker
        const userIcon = L.divIcon({
            html: `<div style="width:20px;height:20px;background:#1565c0;border:3px solid white;border-radius:50%;box-shadow:0 0 0 8px rgba(21,101,192,0.2)"></div>`,
            className: '', iconSize: [20, 20], iconAnchor: [10, 10]
        });
        userMarkerRef.current = L.marker([center.lat, center.lng], { icon: userIcon })
            .addTo(mapRef.current).bindPopup('<b>📍 You are here</b>').openPopup();

        addEquipmentMarkers(center);
    };

    const addEquipmentMarkers = (center) => {
        const L = window.L;
        if (!mapRef.current) return;

        // Clear old equipment markers
        Object.values(markerRefs.current).forEach(m => m.remove());
        markerRefs.current = {};

        const filtered = filterType === 'All' ? equipmentData : equipmentData.filter(e => e.type === filterType);
        filtered.forEach(eq => {
            const lat = center.lat + eq.offset.lat;
            const lng = center.lng + eq.offset.lng;
            const color = typeColors[eq.type];
            const emoji = typeEmoji[eq.type];
            const isSelected = selected?.id === eq.id;

            const icon = L.divIcon({
                html: `
                    <div style="
                        background: ${color};
                        color: white;
                        border-radius: 50%;
                        width: ${isSelected ? '50px' : '38px'};
                        height: ${isSelected ? '50px' : '38px'};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: ${isSelected ? '26px' : '20px'};
                        box-shadow: 0 ${isSelected ? '6px 20px' : '3px 10px'} rgba(0,0,0,0.35);
                        border: ${isSelected ? '4px' : '2px'} solid white;
                        cursor: pointer;
                        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        ${isSelected ? 'animation: pulse 2s infinite;' : ''}
                    ">${emoji}</div>
                `,
                className: '', iconSize: [isSelected ? 50 : 38, isSelected ? 50 : 38], iconAnchor: [isSelected ? 25 : 19, isSelected ? 25 : 19]
            });

            const marker = L.marker([lat, lng], { icon }).addTo(mapRef.current);
            marker.bindTooltip(`<b>${eq.name}</b><br>₹${eq.priceAcre}/acre`, { direction: 'top', offset: [0, -20] });
            marker.on('click', () => {
                setSelected({ ...eq, lat, lng });
                // Center map on selected
                mapRef.current.setView([lat, lng], 14, { animate: true });
            });
            markerRefs.current[eq.id] = marker;
        });
    };

    useEffect(() => {
        // Load Leaflet from CDN
        const loadLeaflet = () => new Promise(resolve => {
            if (window.L) { resolve(); return; }
            if (!document.getElementById('leaflet-css')) {
                const l = document.createElement('link');
                l.id = 'leaflet-css'; l.rel = 'stylesheet';
                l.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(l);
            }
            const s = document.createElement('script');
            s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            s.onload = resolve;
            document.body.appendChild(s);
        });

        loadLeaflet().then(() => {
            if (!navigator.geolocation) {
                setGeoStatus('denied');
                // Fall back to Hyderabad center
                const fallback = { lat: 17.3850, lng: 78.4867 };
                setUserLocation(fallback);
                setLocationName('Hyderabad (fallback)');
                buildMap(fallback);
                return;
            }
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                    setUserLocation(coords);
                    setGeoStatus('granted');
                    const name = await reverseGeocode(coords.lat, coords.lng);
                    setLocationName(name);
                    buildMap(coords);
                },
                () => {
                    setGeoStatus('denied');
                    const fallback = { lat: 17.3850, lng: 78.4867 };
                    setUserLocation(fallback);
                    setLocationName('Hyderabad (GPS denied — using default)');
                    buildMap(fallback);
                },
                { enableHighAccuracy: true, timeout: 12000 }
            );
        });

        return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
    }, []); // eslint-disable-line

    // Re-add markers when filter changes
    useEffect(() => {
        if (userLocation && mapRef.current) addEquipmentMarkers(userLocation);
    }, [filterType, userLocation]); // eslint-disable-line

    return (
        <div className="container flex flex-col gap-md" style={{ maxWidth: '960px' }}>
            <div>
                <h2>Equipment Near You 🗺️</h2>
                {geoStatus === 'granted' && locationName && (
                    <p className="text-muted">📍 Showing equipment near <strong>{locationName}</strong></p>
                )}
                {geoStatus === 'denied' && (
                    <p style={{ color: '#e65100', fontSize: '0.875rem' }}>⚠️ GPS access denied — showing default area. Allow location for real results.</p>
                )}
                {geoStatus === 'requesting' && (
                    <p className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Getting your location…
                    </p>
                )}
            </div>

            {/* Filter tabs */}
            <div className="flex gap-sm" style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {types.map(t => (
                    <button key={t} onClick={() => setFilterType(t)} style={{
                        whiteSpace: 'nowrap', padding: '0.4rem 0.9rem', borderRadius: '99px',
                        border: `1px solid ${filterType === t ? 'transparent' : 'var(--border-color)'}`,
                        background: filterType === t ? (typeColors[t] || 'var(--primary-color)') : 'transparent',
                        color: filterType === t ? 'white' : 'var(--text-muted)',
                        cursor: 'pointer', fontSize: '0.85rem', fontWeight: filterType === t ? '600' : '400'
                    }}>
                        {typeEmoji[t] || ''} {t}
                    </button>
                ))}
            </div>

            {/* Map */}
            <div id="equipment-map" style={{ height: '440px', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', zIndex: 1 }} />

            {/* Selected equipment panel */}
            {selected && (
                <div className="card" style={{ borderLeft: `4px solid ${typeColors[selected.type]}`, position: 'relative', overflow: 'hidden', padding: 0 }}>
                    <div className="flex" style={{ flexWrap: 'wrap' }}>
                        <div style={{ width: '150px', height: '150px', flexShrink: 0, background: '#eee' }}>
                            {selected.image ? (
                                <img src={selected.image} alt={selected.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                                    <Tractor size={48} />
                                </div>
                            )}
                        </div>
                        <div style={{ flex: 1, padding: '1rem' }}>
                            <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: typeColors[selected.type], textTransform: 'uppercase' }}>{typeEmoji[selected.type]} {selected.type}</div>
                                    <h3 style={{ margin: '0.2rem 0' }}>{selected.name}</h3>
                                    <p className="text-muted" style={{ margin: 0, fontSize: '0.875rem' }}>Owner: {selected.owner}</p>
                                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        GPS: {selected.lat.toFixed(5)}, {selected.lng.toFixed(5)}
                                    </p>
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                                        ₹{selected.priceAcre}<span style={{ fontSize: '0.875rem', fontWeight: '400', color: 'var(--text-muted)' }}>/acre</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
                                <a href={`tel:+91${selected.phone}`} className="btn btn-outline" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', padding: '0.4rem' }}>📞 Call</a>
                                <a href={`https://wa.me/91${selected.phone}?text=Hi, I want to book ${selected.name}`} target="_blank" rel="noreferrer" className="btn" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', background: '#25D366', color: 'white', padding: '0.4rem' }}>💬 WA</a>
                                <a href="/farmer" className="btn btn-primary" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', padding: '0.4rem' }}>Book Now →</a>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>✕</button>
                </div>
            )}

            {/* Legend */}
            <div className="card" style={{ padding: '0.75rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div className="flex items-center gap-sm" style={{ fontSize: '0.8rem' }}>
                        <div style={{ width: '16px', height: '16px', background: '#1565c0', borderRadius: '50%', boxShadow: '0 0 0 4px rgba(21,101,192,0.2)' }} /> You
                    </div>
                    {Object.entries(typeColors).map(([type, color]) => (
                        <div key={type} className="flex items-center gap-sm" style={{ fontSize: '0.8rem' }}>
                            <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: color }} />
                            {typeEmoji[type]} {type}
                        </div>
                    ))}
                </div>
            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
