import React, { useState } from 'react';
import { CheckCircle, Clock, XCircle, Star } from 'lucide-react';

const mockHistory = [
    { id: 201, equipment: "Mahindra 575 DI", type: "Tractor", date: "Feb 28, 2026", acres: null, hours: 4, amount: 2000, status: "Completed", rated: false },
    { id: 202, equipment: "Preet 987", type: "Paddy Harvester", date: "Feb 20, 2026", acres: 3, hours: null, amount: 9400, status: "Completed", rated: true, myRating: 5 },
    { id: 203, equipment: "Fieldking Rotavator", type: "Rotavator", date: "Mar 5, 2026", acres: 2, hours: null, amount: 1200, status: "Upcoming", rated: false },
    { id: 204, equipment: "Kartar 4000", type: "Maize Harvester", date: "Jan 15, 2026", acres: 4, hours: null, amount: 14000, status: "Cancelled", rated: false },
];

const statusConfig = {
    Completed: { color: '#2e7d32', bg: '#e8f5e9', icon: CheckCircle },
    Upcoming: { color: '#1565c0', bg: '#e3f2fd', icon: Clock },
    Cancelled: { color: '#c62828', bg: '#ffebee', icon: XCircle },
};

function StarSelector({ onRate }) {
    const [hovered, setHovered] = useState(0);
    const [selected, setSelected] = useState(0);
    return (
        <div>
            <div className="flex gap-sm" style={{ marginTop: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map(i => (
                    <Star
                        key={i}
                        size={28}
                        fill={i <= (hovered || selected) ? '#fbc02d' : 'none'}
                        color={i <= (hovered || selected) ? '#fbc02d' : '#ccc'}
                        style={{ cursor: 'pointer', transition: 'transform 0.1s' }}
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(0)}
                        onClick={() => { setSelected(i); onRate(i); }}
                    />
                ))}
            </div>
            {selected > 0 && (
                <p style={{ color: 'var(--primary-color)', fontWeight: 'bold', marginTop: '0.5rem' }}>
                    ✅ Thanks for rating {selected} ⭐{selected > 1 ? 's' : ''}!
                </p>
            )}
        </div>
    );
}

export default function BookingHistory() {
    const [bookings, setBookings] = useState(mockHistory);

    const handleRate = (id, rating) => {
        setBookings(bookings.map(b => b.id === id ? { ...b, rated: true, myRating: rating } : b));
    };

    return (
        <div className="container flex flex-col gap-lg" style={{ maxWidth: '700px' }}>
            <div>
                <h2>My Booking History</h2>
                <p className="text-muted">All your past and upcoming equipment bookings</p>
            </div>

            <div className="flex flex-col gap-md">
                {bookings.map(booking => {
                    const cfg = statusConfig[booking.status];
                    const Icon = cfg.icon;
                    return (
                        <div key={booking.id} className="card" style={{ borderLeft: `4px solid ${cfg.color}` }}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{booking.type}</div>
                                    <h4 style={{ margin: 0 }}>{booking.equipment}</h4>
                                    <p className="text-muted" style={{ margin: '0.25rem 0 0', fontSize: '0.875rem' }}>
                                        📅 {booking.date} &bull; {booking.hours ? `${booking.hours} hrs` : `${booking.acres} acres`}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--primary-color)' }}>₹{booking.amount.toLocaleString()}</div>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: cfg.bg, color: cfg.color, padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 'bold', marginTop: '0.3rem' }}>
                                        <Icon size={13} /> {booking.status}
                                    </span>
                                </div>
                            </div>

                            {booking.status === 'Completed' && (
                                <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                                    {booking.rated ? (
                                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                            Your rating: {Array.from({ length: booking.myRating }, (_, i) => '⭐').join('')}
                                        </p>
                                    ) : (
                                        <div>
                                            <p style={{ margin: 0, fontWeight: '500', fontSize: '0.875rem' }}>Rate this service:</p>
                                            <StarSelector onRate={(r) => handleRate(booking.id, r)} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
