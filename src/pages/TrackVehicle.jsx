import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Navigation, Phone, MessageCircle, Clock, Loader2 } from 'lucide-react';

// Haversine formula: accurate real-world distance in km between two GPS points
function haversineDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Interpolate position: fraction 0→1 moves vehicle from start→end
function interpolate(lat1, lng1, lat2, lng2, fraction) {
    return {
        lat: lat1 + (lat2 - lat1) * fraction,
        lng: lng1 + (lng2 - lng1) * fraction,
    };
}

// Reverse geocode using free OpenStreetMap Nominatim
async function reverseGeocode(lat, lng) {
    try {
        const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
        );
        const d = await r.json();
        return d.display_name?.split(',').slice(0, 3).join(', ') || 'Unknown location';
    } catch {
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
}

export default function TrackVehicle() {
    const [userPos, setUserPos] = useState(null);
    const [vehiclePos, setVehiclePos] = useState(null);
    const [vehicleStart, setVehicleStart] = useState(null);
    const [fraction, setFraction] = useState(0);
    const [distance, setDistance] = useState(null);
    const [eta, setEta] = useState(null);
    const [status, setStatus] = useState('Locating your position...');
    const [userAddress, setUserAddress] = useState('');
    const [vehicleAddress, setVehicleAddress] = useState('');
    const [geoError, setGeoError] = useState('');
    const mapRef = useRef(null);
    const leafletMap = useRef(null);
    const userMarker = useRef(null);
    const vehicleMarker = useRef(null);
    const routeLine = useRef(null);
    const intervalRef = useRef(null);

    // Average speed of tractor: ~15 km/h
    const VEHICLE_SPEED_KMH = 15;

    const initMap = useCallback((center) => {
        if (leafletMap.current) return;
        const L = window.L;
        leafletMap.current = L.map('track-map').setView([center.lat, center.lng], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(leafletMap.current);
    }, []);

    const updateMapMarkers = useCallback((user, vehicle) => {
        const L = window.L;
        if (!leafletMap.current) return;

        // User marker (blue pulsing)
        const userIcon = L.divIcon({
            html: `<div style="width:18px;height:18px;background:#1565c0;border:3px solid white;border-radius:50%;box-shadow:0 0 0 6px rgba(21,101,192,0.25)"></div>`,
            className: '', iconSize: [18, 18], iconAnchor: [9, 9]
        });
        if (userMarker.current) userMarker.current.setLatLng([user.lat, user.lng]);
        else userMarker.current = L.marker([user.lat, user.lng], { icon: userIcon }).addTo(leafletMap.current).bindPopup('📍 You are here');

        // Vehicle marker (tractor emoji)
        const vehIcon = L.divIcon({
            html: `<div style="font-size:28px;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4))">🚜</div>`,
            className: '', iconSize: [32, 32], iconAnchor: [16, 16]
        });
        if (vehicleMarker.current) vehicleMarker.current.setLatLng([vehicle.lat, vehicle.lng]);
        else vehicleMarker.current = L.marker([vehicle.lat, vehicle.lng], { icon: vehIcon }).addTo(leafletMap.current).bindPopup('🚜 Your booked equipment');

        // Route line
        if (routeLine.current) leafletMap.current.removeLayer(routeLine.current);
        routeLine.current = L.polyline([[user.lat, user.lng], [vehicle.lat, vehicle.lng]], {
            color: '#2e7d32', weight: 3, dashArray: '8,8', opacity: 0.8
        }).addTo(leafletMap.current);

        // Fit both in view
        leafletMap.current.fitBounds([[user.lat, user.lng], [vehicle.lat, vehicle.lng]], { padding: [50, 50] });
    }, []);

    const startTracking = useCallback(async (userCoords) => {
        initMap(userCoords);

        // Place vehicle 3–6 km away from user in a random direction
        const dx = (Math.random() - 0.5) * 0.08;
        const dy = (Math.random() - 0.5) * 0.08;
        const start = { lat: userCoords.lat + dx, lng: userCoords.lng + dy };
        setVehicleStart(start);
        setVehiclePos(start);

        // Get real addresses
        const [uAddr, vAddr] = await Promise.all([
            reverseGeocode(userCoords.lat, userCoords.lng),
            reverseGeocode(start.lat, start.lng),
        ]);
        setUserAddress(uAddr);
        setVehicleAddress(vAddr);

        const totalDist = haversineDistance(userCoords.lat, userCoords.lng, start.lat, start.lng);
        setDistance(totalDist);
        const totalMinutes = (totalDist / VEHICLE_SPEED_KMH) * 60;
        setEta(Math.ceil(totalMinutes));
        setStatus('En route to your location');

        updateMapMarkers(userCoords, start);

        // Animate vehicle moving every 3s
        const totalSteps = Math.ceil(totalMinutes * 60 / 3); // 3s ticks
        let step = 0;
        intervalRef.current = setInterval(() => {
            step++;
            const f = Math.min(step / totalSteps, 1);
            setFraction(f);
            const newPos = interpolate(start.lat, start.lng, userCoords.lat, userCoords.lng, f);
            setVehiclePos(newPos);

            const remaining = haversineDistance(newPos.lat, newPos.lng, userCoords.lat, userCoords.lng);
            setDistance(remaining);
            setEta(Math.max(1, Math.ceil((remaining / VEHICLE_SPEED_KMH) * 60)));

            if (vehicleMarker.current) vehicleMarker.current.setLatLng([newPos.lat, newPos.lng]);
            if (routeLine.current) routeLine.current.setLatLngs([[userCoords.lat, userCoords.lng], [newPos.lat, newPos.lng]]);

            // Update vehicle address occasionally
            if (step % 10 === 0) {
                reverseGeocode(newPos.lat, newPos.lng).then(setVehicleAddress);
            }

            if (f >= 1) {
                clearInterval(intervalRef.current);
                setStatus('✅ Equipment has arrived at your location!');
                setDistance(0);
                setEta(0);
            }
        }, 3000);
    }, [initMap, updateMapMarkers]);

    useEffect(() => {
        // Load Leaflet CSS and JS
        const loadLeaflet = () => new Promise((resolve) => {
            if (window.L) { resolve(); return; }
            if (!document.getElementById('leaflet-css')) {
                const link = document.createElement('link');
                link.id = 'leaflet-css';
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(link);
            }
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = resolve;
            document.body.appendChild(script);
        });

        loadLeaflet().then(() => {
            if (!navigator.geolocation) {
                setGeoError('Geolocation is not supported by your browser.');
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                    setUserPos(coords);
                    startTracking(coords);
                },
                (err) => {
                    setGeoError(`Location access denied: ${err.message}. Please allow location access and reload.`);
                    setStatus('Location access required');
                },
                { enableHighAccuracy: true, timeout: 15000 }
            );
        });

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (leafletMap.current) { leafletMap.current.remove(); leafletMap.current = null; }
        };
    }, [startTracking]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 70px)' }}>
            {/* Status bar */}
            <div style={{ background: 'var(--primary-color)', color: 'white', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Navigation size={20} />
                    <span style={{ fontWeight: 'bold' }}>{status}</span>
                </div>
                {distance !== null && distance > 0 && (
                    <>
                        <span style={{ opacity: 0.8 }}>|</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <MapPin size={16} />
                            <span>{distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)} km`} away</span>
                        </div>
                        <span style={{ opacity: 0.8 }}>|</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Clock size={16} />
                            <span>ETA: {eta} min</span>
                        </div>
                    </>
                )}
                {distance === 0 && <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>🎉 Equipment Arrived!</span>}
            </div>

            {/* Map */}
            <div style={{ flex: 1, position: 'relative' }}>
                {geoError && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 999, background: 'white', padding: '2rem', borderRadius: '12px', maxWidth: '340px', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
                        <p style={{ color: '#c62828', fontWeight: 'bold' }}>📍 {geoError}</p>
                    </div>
                )}
                {!userPos && !geoError && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 999, textAlign: 'center' }}>
                        <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary-color)' }} />
                        <p style={{ color: 'var(--primary-color)', marginTop: '1rem' }}>Getting your GPS location…</p>
                    </div>
                )}
                <div id="track-map" style={{ width: '100%', height: '100%' }} />
            </div>

            {/* Bottom info cards */}
            {userPos && (
                <div style={{ background: 'white', borderTop: '1px solid var(--border-color)', padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
                        {/* Status Card */}
                        <div className="card" style={{ padding: '0.75rem', position: 'relative', overflow: 'hidden' }}>
                            <div className="flex gap-md">
                                <div style={{ width: '100px', height: '80px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: '#eee' }}>
                                    <img
                                        src="https://images.unsplash.com/photo-1594488311306-029da6396e95?auto=format&fit=crop&q=80&w=200"
                                        alt="Mahindra 575 DI"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Mahindra 575 DI</h3>
                                            <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>Track ID: HH-98421 • Driver: Ramesh</p>
                                        </div>
                                        <span className={`badge ${distance === 0 ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.75rem' }}>
                                            {distance === 0 ? 'ARRIVED ✅' : 'ON THE WAY 🚜'}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-end" style={{ marginTop: '0.75rem' }}>
                                        <div>
                                            <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--primary-color)', lineHeight: 1 }}>
                                                {distance === 0 ? '0' : Math.round(eta)} <span style={{ fontSize: '1rem', fontWeight: '400', color: 'var(--text-muted)' }}>mins away</span>
                                            </div>
                                            <div className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                <MapPin size={12} /> {vehicleAddress.substring(0, 40)}{vehicleAddress.length > 40 ? '…' : ''}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{distance.toFixed(1)} km</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>remaining</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '1rem' }}>
                                <div style={{ height: '8px', width: '100%', background: '#eee', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%',
                                        width: distance === 0 ? '100%' : (() => {
                                            const total = vehicleStart ? haversineDistance(userPos.lat, userPos.lng, vehicleStart.lat, vehicleStart.lng) : 5;
                                            return `${(1 - (distance / (total || 1))) * 100}%`;
                                        })(),
                                        background: 'var(--primary-color)',
                                        borderRadius: '4px',
                                        transition: 'width 2.5s linear'
                                    }} />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-md">
                            <a href="tel:+919848012345" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                                <Phone size={18} /> Call Driver
                            </a>
                            <a href="https://wa.me/919848012345" target="_blank" rel="noreferrer" className="btn" style={{ flex: 1, justifyContent: 'center', gap: '0.5rem', background: '#25D366', color: 'white', textDecoration: 'none' }}>
                                <MessageCircle size={18} /> WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            )}

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
