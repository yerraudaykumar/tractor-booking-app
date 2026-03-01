import React, { useState } from 'react';
import { DollarSign, CalendarCheck, Plus, X, ChevronDown, AlertCircle, CheckCircle, Camera, Image as ImageIcon, Tractor } from 'lucide-react';

const EQUIPMENT_TYPES = ['Tractor', 'Paddy Harvester', 'Maize Harvester', 'Sprayer', 'Seed Drill', 'Rotavator'];

const initialRequests = [
    { id: 101, farmer: "Kisan Lal", equipment: "Mahindra 575 DI", eqType: "Tractor", isUrgent: false, date: "Oct 24", duration: "4 hrs", earned: 2000, status: "Pending" },
    { id: 102, farmer: "Mohan Das", equipment: "Preet 987", eqType: "Paddy Harvester", isUrgent: true, date: "Oct 25", duration: "3 acres", earned: 8400, status: "Pending" },
    { id: 103, farmer: "Suresh P.", equipment: "Mahindra 575 DI", eqType: "Tractor", isUrgent: false, date: "Oct 22", duration: "2 hrs", earned: 1000, status: "Completed" },
];

const initialEquipment = [
    { id: 1, name: "Mahindra 575 DI", type: "Tractor", power: "45 HP", priceHr: 500, priceAcre: 1000, village: "Chevella", image: null },
    { id: 2, name: "Fieldking Rotavator", type: "Rotavator", power: "48 HP", priceHr: 350, priceAcre: 600, village: "Shadnagar", image: null },
];

const emptyForm = { name: '', type: 'Tractor', power: '', priceHr: '', priceAcre: '', village: '', image: null };

export default function OwnerDashboard() {
    const [requests, setRequests] = useState(initialRequests);
    const [equipmentList, setEquipmentList] = useState(initialEquipment);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [formError, setFormError] = useState('');
    const [saved, setSaved] = useState(false);

    const handleAccept = (id) => setRequests(r => r.map(req => req.id === id ? { ...req, status: 'Accepted' } : req));
    const handleReject = (id) => setRequests(r => r.map(req => req.id === id ? { ...req, status: 'Rejected' } : req));

    const handleFormChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleImageCapture = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm(f => ({ ...f, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddEquipment = (e) => {
        e.preventDefault();
        setFormError('');
        if (!form.name.trim()) { setFormError('Equipment name is required'); return; }
        if (!form.priceAcre || isNaN(form.priceAcre) || Number(form.priceAcre) <= 0) { setFormError('Enter a valid price per acre'); return; }

        const newItem = {
            id: Date.now(),
            name: form.name.trim(),
            type: form.type,
            power: form.power || '—',
            priceHr: form.priceHr ? Number(form.priceHr) : null,
            priceAcre: Number(form.priceAcre),
            village: form.village || 'Your location',
            image: form.image
        };
        setEquipmentList(list => [newItem, ...list]);
        setForm(emptyForm);
        setShowForm(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const removeEquipment = (id) => setEquipmentList(list => list.filter(e => e.id !== id));

    const totalEarned = requests.filter(r => r.status === 'Completed' || r.status === 'Accepted').reduce((s, r) => s + r.earned, 0);

    return (
        <div className="container flex flex-col gap-lg" style={{ marginTop: '1.5rem' }}>
            <div className="card glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0 }}>Owner Control Center</h2>
                    <p className="text-muted" style={{ margin: 0 }}>Managing as <strong>yerraudaykumar</strong> 👋</p>
                </div>
            </div>

            {/* Success toast */}
            {saved && (
                <div style={{ background: '#e8f5e9', border: '1px solid #4caf50', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2e7d32', fontWeight: '600' }}>
                    <CheckCircle size={18} /> Equipment added successfully!
                </div>
            )}

            {/* Stats */}
            <div className="flex gap-md w-full" style={{ flexWrap: 'wrap' }}>
                <div className="card text-center" style={{ flex: 1, minWidth: '180px' }}>
                    <div style={{ background: '#e1f5fe', width: '48px', height: '48px', borderRadius: '50%', margin: '0 auto 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0288d1' }}>
                        <DollarSign size={22} />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', margin: 0 }}>₹{(12500 + totalEarned).toLocaleString()}</h2>
                    <p className="text-muted" style={{ margin: 0, fontSize: '0.875rem' }}>Earnings this Month</p>
                </div>
                <div className="card text-center" style={{ flex: 1, minWidth: '180px' }}>
                    <div style={{ background: '#e8f5e9', width: '48px', height: '48px', borderRadius: '50%', margin: '0 auto 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                        <CalendarCheck size={22} />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', margin: 0 }}>{14 + requests.filter(r => r.status === 'Accepted').length}</h2>
                    <p className="text-muted" style={{ margin: 0, fontSize: '0.875rem' }}>Bookings Completed</p>
                </div>
                <div className="card text-center" style={{ flex: 1, minWidth: '180px' }}>
                    <div style={{ background: '#fff3e0', width: '48px', height: '48px', borderRadius: '50%', margin: '0 auto 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e65100' }}>
                        <AlertCircle size={22} />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', margin: 0 }}>{requests.filter(r => r.status === 'Pending').length}</h2>
                    <p className="text-muted" style={{ margin: 0, fontSize: '0.875rem' }}>Pending Requests</p>
                </div>
            </div>

            {/* System Infrastructure Status */}
            <div className="card glass" style={{ borderLeft: '4px solid #0288d1', background: '#f0faff', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(2,136,209,0.08)' }}>
                <h3 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1rem', color: '#01579b' }}>
                    🌐 System Infrastructure Health
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.5rem' }}>
                    <div className="flex flex-col">
                        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#777', fontWeight: '800', letterSpacing: '0.5px' }}>GitHub Repository</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', marginTop: '0.2rem' }}>📦 tractor-booking-app</span>
                    </div>
                    <div className="flex flex-col">
                        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#777', fontWeight: '800', letterSpacing: '0.5px' }}>Network Security</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#2e7d32', marginTop: '0.2rem' }}>🛡️ Firewall Active</span>
                    </div>
                    <div className="flex flex-col">
                        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#777', fontWeight: '800', letterSpacing: '0.5px' }}>Global Edge</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', marginTop: '0.2rem' }}>⚡ Vercel Deployment</span>
                    </div>
                    <div className="flex flex-col">
                        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#777', fontWeight: '800', letterSpacing: '0.5px' }}>Encryption</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#2e7d32', marginTop: '0.2rem' }}>🔒 256-bit SSL</span>
                    </div>
                </div>
            </div>

            {/* ─── MY EQUIPMENT ─── */}
            <div>
                <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                    <h2 style={{ margin: 0 }}>My Equipment</h2>
                    <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', gap: '0.4rem' }} onClick={() => setShowForm(!showForm)}>
                        {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add Equipment</>}
                    </button>
                </div>

                {/* Add Equipment Form */}
                {showForm && (
                    <div className="card" style={{ marginBottom: '1rem', border: '2px solid var(--primary-color)' }}>
                        <h3 style={{ margin: '0 0 1rem' }}>📋 New Equipment Details</h3>
                        <form onSubmit={handleAddEquipment}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <div className="input-group">
                                    <label className="input-label">Equipment Name *</label>
                                    <input name="name" className="input-field" placeholder="e.g. Mahindra 575 DI" value={form.name} onChange={handleFormChange} required />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Equipment Type *</label>
                                    <div style={{ position: 'relative' }}>
                                        <select name="type" className="input-field" style={{ appearance: 'none', paddingRight: '2rem' }} value={form.type} onChange={handleFormChange}>
                                            {EQUIPMENT_TYPES.map(t => <option key={t}>{t}</option>)}
                                        </select>
                                        <ChevronDown size={16} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Power / Capacity</label>
                                    <input name="power" className="input-field" placeholder="e.g. 45 HP or 600L" value={form.power} onChange={handleFormChange} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Price per Acre (₹) *</label>
                                    <input name="priceAcre" type="number" min="1" className="input-field" placeholder="e.g. 1000" value={form.priceAcre} onChange={handleFormChange} required />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Price per Hour (₹) <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>— optional</span></label>
                                    <input name="priceHr" type="number" min="1" className="input-field" placeholder="e.g. 400" value={form.priceHr} onChange={handleFormChange} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Village / Area</label>
                                    <input name="village" className="input-field" placeholder="e.g. Chevella, Rangareddy" value={form.village} onChange={handleFormChange} />
                                </div>
                                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="input-label">Live Machinery Image (Camera/Upload) *</label>
                                    <div className="flex gap-md items-center">
                                        <label className="btn btn-outline" style={{ cursor: 'pointer', flex: 1, borderStyle: 'dashed', height: '120px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <Camera size={32} />
                                            <span>Click to Capture or Upload</span>
                                            <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleImageCapture} />
                                        </label>
                                        {form.image ? (
                                            <div style={{ position: 'relative', width: '200px', height: '120px' }}>
                                                <img src={form.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                                                <button type="button" onClick={() => setForm(f => ({ ...f, image: null }))} style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--danger-color)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div style={{ width: '200px', height: '120px', background: '#f5f5f5', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', border: '1px solid var(--border-color)' }}>
                                                <ImageIcon size={32} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {formError && (
                                <p style={{ color: '#c62828', fontSize: '0.875rem', margin: '0.75rem 0 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <AlertCircle size={14} /> {formError}
                                </p>
                            )}
                            <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem' }}>Save Equipment</button>
                                <button type="button" className="btn btn-outline" onClick={() => { setShowForm(false); setForm(emptyForm); setFormError(''); }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Equipment list */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                    {equipmentList.map(eq => (
                        <div key={eq.id} className="card" style={{ position: 'relative', padding: 0, overflow: 'hidden' }}>
                            <button onClick={() => removeEquipment(eq.id)} style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#c62828', zIndex: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                <X size={14} />
                            </button>
                            <div style={{ height: '140px', width: '100%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                                {eq.image ? (
                                    <img src={eq.image} alt={eq.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div className="flex flex-col items-center gap-sm">
                                        <Tractor size={40} />
                                        <span style={{ fontSize: '0.7rem' }}>No Image</span>
                                    </div>
                                )}
                            </div>
                            <div style={{ padding: '1rem' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{eq.type}</div>
                                <h4 style={{ margin: '0 0 0.25rem' }}>{eq.name}</h4>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{eq.power} · {eq.village}</div>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <span style={{ background: '#e8f5e9', color: 'var(--primary-color)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>₹{eq.priceAcre}/acre</span>
                                    {eq.priceHr && <span style={{ background: '#e3f2fd', color: '#1565c0', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>₹{eq.priceHr}/hr</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ─── BOOKING REQUESTS ─── */}
            <div>
                <h2>Booking Requests</h2>
                <div className="card">
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                                    {['Farmer', 'Equipment', 'Date', 'Duration', 'Earning', 'Status', 'Action'].map(h => (
                                        <th key={h} style={{ padding: '0.85rem 0.6rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map(req => (
                                    <tr key={req.id} style={{ borderBottom: '1px solid var(--border-color)', background: req.isUrgent ? '#fff8e1' : 'transparent', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '0.85rem 0.6rem', fontWeight: '500' }}>
                                            {req.farmer}
                                            {req.isUrgent && <span style={{ marginLeft: '0.4rem', fontSize: '0.72rem', color: '#d32f2f', fontWeight: 'bold' }}>🔥 URGENT</span>}
                                        </td>
                                        <td style={{ padding: '0.85rem 0.6rem' }}>
                                            <div style={{ fontWeight: '500' }}>{req.equipment}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.eqType}</div>
                                        </td>
                                        <td style={{ padding: '0.85rem 0.6rem', whiteSpace: 'nowrap' }}>{req.date}</td>
                                        <td style={{ padding: '0.85rem 0.6rem' }}>{req.duration}</td>
                                        <td style={{ padding: '0.85rem 0.6rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>₹{req.earned}</td>
                                        <td style={{ padding: '0.85rem 0.6rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 'bold',
                                                background: req.status === 'Completed' || req.status === 'Accepted' ? '#e8f5e9' : req.status === 'Rejected' ? '#ffebee' : '#fff8e1',
                                                color: req.status === 'Completed' || req.status === 'Accepted' ? '#2e7d32' : req.status === 'Rejected' ? '#c62828' : '#f57f17'
                                            }}>{req.status}</span>
                                        </td>
                                        <td style={{ padding: '0.85rem 0.6rem', textAlign: 'right' }}>
                                            {req.status === 'Pending' ? (
                                                <div className="flex gap-sm" style={{ justifyContent: 'flex-end' }}>
                                                    <button className="btn btn-primary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleAccept(req.id)}>Accept</button>
                                                    <button className="btn btn-outline" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem', color: '#c62828', borderColor: '#c62828' }} onClick={() => handleReject(req.id)}>Reject</button>
                                                </div>
                                            ) : (
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
