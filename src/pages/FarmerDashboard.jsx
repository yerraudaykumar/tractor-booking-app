import React, { useState } from 'react';
import { Search, MapPin, Calendar, Clock, ChevronRight, Star, Tractor } from 'lucide-react';

const mockEquipment = [
    { id: 1, type: "Tractor", name: "Mahindra 575 DI", power: "45 HP", priceHr: 500, priceAcre: 1000, distance: "2.5 km", owner: "Ramesh K.", phone: "9848012345", rating: 4.8, reviewCount: 32, image: "https://images.unsplash.com/photo-1594488311306-029da6396e95?auto=format&fit=crop&q=80&w=400" },
    { id: 2, type: "Tractor", name: "Swaraj 744 FE", power: "48 HP", priceHr: 550, priceAcre: 1100, distance: "3.1 km", owner: "Suresh P.", phone: "9849123456", rating: 4.6, reviewCount: 18, image: "https://images.unsplash.com/photo-1594488311210-9097746bc560?auto=format&fit=crop&q=80&w=400" },
    { id: 3, type: "Paddy Harvester", name: "Preet 987", power: "76 HP", priceHr: null, priceAcre: 2800, distance: "8.0 km", owner: "Vijay S.", phone: "9100023456", rating: 4.9, reviewCount: 44, image: "https://images.unsplash.com/photo-1599557929452-3fb86e680a31?auto=format&fit=crop&q=80&w=400" },
    { id: 4, type: "Maize Harvester", name: "Kartar 4000", power: "101 HP", priceHr: null, priceAcre: 3500, distance: "12.5 km", owner: "Reddy Farms", phone: "9701234567", rating: 4.7, reviewCount: 11, image: "https://images.unsplash.com/photo-1599557929419-f55e090f7d49?auto=format&fit=crop&q=80&w=400" },
    { id: 5, type: "Sprayer", name: "Boom Sprayer 600L", power: "Motorized", priceHr: null, priceAcre: 800, distance: "4.2 km", owner: "Prakash N.", phone: "9550012345", rating: 4.4, reviewCount: 8, image: "https://images.unsplash.com/photo-1594488311252-0fb3264426d5?auto=format&fit=crop&q=80&w=400" },
    { id: 6, type: "Seed Drill", name: "Happy Seeder 9-Row", power: "55 HP", priceHr: null, priceAcre: 1200, distance: "6.0 km", owner: "Mohan Rao", phone: "9440123456", rating: 4.5, reviewCount: 14, image: "https://images.unsplash.com/photo-1592834306352-7f28dc07da25?auto=format&fit=crop&q=80&w=400" },
    { id: 7, type: "Rotavator", name: "Fieldking Rotavator", power: "48 HP", priceHr: 350, priceAcre: 600, distance: "1.8 km", owner: "Srinivas K.", phone: "9866012345", rating: 4.7, reviewCount: 26, image: "https://images.unsplash.com/photo-1594488311138-09746bc56081?auto=format&fit=crop&q=80&w=400" },
];

export default function FarmerDashboard() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedEquipment, setSelectedEquipment] = useState(null);

    if (selectedEquipment) {
        return <BookingFlow equipment={selectedEquipment} onBack={() => setSelectedEquipment(null)} />;
    }

    const filteredEquipment = mockEquipment.filter(item => {
        const matchesCategory = selectedCategory === "All" || item.type === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const categories = ["All", "Tractor", "Paddy Harvester", "Maize Harvester", "Sprayer", "Seed Drill", "Rotavator"];

    return (
        <div className="container flex flex-col gap-lg">
            <div className="card glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0 }}>Find Equipment & Harvesters</h2>
                    <p className="text-muted" style={{ margin: 0 }}>Welcome back, <strong>yerraudaykumar</strong> 👋</p>
                </div>
                <div style={{ textAlign: 'right', display: 'none' }}>{/* Hide on mobile if needed */}</div>
            </div>

            <div className="card glass">

                <div className="flex gap-sm" style={{ marginTop: '1rem', overflowX: 'auto', paddingBottom: '0.75rem', scrollbarWidth: 'none' }}>
                    {categories.map(cat => {
                        const isSelected = selectedCategory === cat;
                        return (
                            <button
                                key={cat}
                                style={{
                                    whiteSpace: 'nowrap',
                                    cursor: 'pointer',
                                    padding: '0.4rem 1rem',
                                    borderRadius: '99px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    transition: 'all 0.2s ease',
                                    border: '1.5px solid',
                                    borderColor: isSelected ? 'var(--primary-color)' : 'var(--border-color)',
                                    background: isSelected ? 'var(--primary-color)' : 'transparent',
                                    color: isSelected ? 'white' : 'var(--text-muted)',
                                    boxShadow: isSelected ? '0 4px 12px rgba(46,125,50,0.2)' : 'none',
                                    transform: isSelected ? 'translateY(-2px)' : 'none'
                                }}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>

                <div className="input-group" style={{ flexDirection: 'row', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            className="input-field w-full"
                            style={{ paddingLeft: '2.5rem' }}
                            placeholder="Search machinery names..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary">Search</button>
                </div>
            </div>

            <div>
                <h3 style={{ marginBottom: '1rem' }}>Available Today</h3>
                <div className="flex flex-col gap-md">
                    {filteredEquipment.length === 0 ? (
                        <p className="text-muted" style={{ textAlign: 'center', padding: '2rem' }}>No equipment found matching criteria.</p>
                    ) : (
                        filteredEquipment.map(item => (
                            <div key={item.id} className="card flex items-center gap-md" style={{ cursor: 'pointer', padding: '0.75rem' }} onClick={() => setSelectedEquipment(item)}>
                                <div style={{ width: '100px', height: '80px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', background: '#f5f5f5' }}>
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', background: item.type.includes('Harvester') ? '#fff3e0' : '#e8f5e9' }}>
                                            <Tractor size={32} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between items-center w-full">
                                    <div>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{item.type}</div>
                                        <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {item.name} <span className="badge badge-success" style={{ background: '#e0e0e0', color: '#333', fontSize: '0.7rem' }}>{item.power}</span>
                                        </h4>
                                        <p className="text-muted flex items-center gap-sm" style={{ margin: '0.15rem 0 0 0', fontSize: '0.8rem' }}>
                                            <MapPin size={12} /> {item.distance} away • <Star size={12} style={{ color: '#fbc02d' }} /> {item.rating}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                                            ₹{item.priceAcre}<span style={{ fontSize: '0.8rem', fontWeight: '400', color: 'var(--text-muted)' }}>/ac</span>
                                        </div>
                                        <ChevronRight size={18} color="var(--text-muted)" />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function BookingFlow({ equipment, onBack }) {
    // Acres-only types: Harvesters, Sprayers, Seed Drills
    const isHarvester = equipment.type.includes('Harvester') || equipment.type === 'Sprayer' || equipment.type === 'Seed Drill';
    const [step, setStep] = useState(1);
    const [bookingType, setBookingType] = useState(isHarvester ? 'acres' : 'hours');
    const [duration, setDuration] = useState('');
    const [isUrgent, setIsUrgent] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cash');

    const estimate = bookingType === 'hours' && equipment.priceHr ? (equipment.priceHr * (duration || 0)) : (equipment.priceAcre * (duration || 0));
    const totalAmount = isUrgent ? estimate + 500 : estimate;

    const handleRazorpay = () => {
        const options = {
            key: 'rzp_test_DEMO_KEY', amount: totalAmount * 100, currency: 'INR',
            name: 'HarvesterHub', description: `Booking - ${equipment.name}`,
            handler: () => { alert('\u2705 Payment Successful! Booking Confirmed.'); onBack(); },
            prefill: { name: 'Demo Farmer', contact: '9848012345' },
            theme: { color: '#2e7d32' }
        };
        if (window.Razorpay) {
            new window.Razorpay(options).open();
        } else {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => { new window.Razorpay(options).open(); };
            document.body.appendChild(script);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px' }}>
            <button className="btn btn-outline" style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }} onClick={onBack}>
                &larr; Back to Search
            </button>

            <div className="card flex flex-col gap-md">
                {/* Step Indicator Bubbles */}
                <div className="flex justify-center items-center gap-md" style={{ marginBottom: '0.5rem' }}>
                    {[1, 2].map(s => (
                        <React.Fragment key={s}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 'bold', fontSize: '0.8rem',
                                background: step >= s ? 'var(--primary-color)' : '#eee',
                                color: step >= s ? 'white' : '#999',
                                transition: 'all 0.3s'
                            }}>
                                {s}
                            </div>
                            {s === 1 && <div style={{ height: '2px', width: '40px', background: step > 1 ? 'var(--primary-color)' : '#eee' }} />}
                        </React.Fragment>
                    ))}
                </div>

                <div className="flex justify-between items-center border-b" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', marginTop: '0.5rem' }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{equipment.type}</div>
                        <h2 style={{ margin: 0 }}>FarmSetu</h2>
                        <p style={{ margin: '-0.4rem 0 0.5rem', fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: '600' }}>by yerraudaykumar</p>
                        <p className="text-muted m-0" style={{ fontSize: '0.875rem' }}>by {equipment.owner} &bull; {equipment.distance}</p>
                        <div className="flex gap-sm" style={{ marginTop: '0.5rem' }}>
                            <a href={`tel:+91${equipment.phone}`} className="btn btn-outline" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', textDecoration: 'none' }}>📞 Call</a>
                            <a href={`https://wa.me/91${equipment.phone}?text=Hi, I want to book ${equipment.name}`} target="_blank" rel="noreferrer" className="btn" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', background: '#25D366', color: 'white', textDecoration: 'none' }}>💬 WhatsApp</a>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        {equipment.priceHr && (
                            <div style={{ background: 'var(--primary-color)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', fontWeight: 'bold', marginBottom: '0.2rem' }}>
                                ₹{equipment.priceHr}/hr
                            </div>
                        )}
                        <div style={{ background: equipment.priceHr ? 'var(--secondary-color)' : 'var(--primary-color)', color: equipment.priceHr ? 'var(--text-main)' : 'white', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', fontWeight: 'bold', fontSize: '0.875rem' }}>
                            ₹{equipment.priceAcre}/acre
                        </div>
                    </div>
                </div>

                {step === 1 && (
                    <div className="flex flex-col gap-md">
                        <h3>Select Date & Time</h3>
                        <div className="flex gap-md">
                            <div className="input-group" style={{ flex: 1 }}>
                                <label className="input-label flex items-center gap-sm"><Calendar size={16} /> Date</label>
                                <input type="date" className="input-field" />
                            </div>
                            <div className="input-group" style={{ flex: 1 }}>
                                <label className="input-label flex items-center gap-sm"><Clock size={16} /> Start Time</label>
                                <input type="time" className="input-field" />
                            </div>
                        </div>
                        {isHarvester && (
                            <div style={{ background: '#fff8e1', border: '1px solid #ffca28', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 'bold', color: '#f57f17' }}>
                                    <input
                                        type="checkbox"
                                        checked={isUrgent}
                                        onChange={(e) => setIsUrgent(e.target.checked)}
                                        style={{ width: '1.2rem', height: '1.2rem' }}
                                    />
                                    🔥 Request Urgent Harvest (Priority Listing)
                                </label>
                            </div>
                        )}

                        <div className="input-group">
                            <label className="input-label">Booking Type</label>
                            <div className="flex gap-sm">
                                {!isHarvester && (
                                    <button
                                        className={`btn ${bookingType === 'hours' ? 'btn-primary' : 'btn-outline'}`}
                                        style={{ flex: 1 }}
                                        onClick={() => setBookingType('hours')}
                                    >
                                        By Hours
                                    </button>
                                )}
                                <button
                                    className={`btn ${bookingType === 'acres' ? 'btn-primary' : 'btn-outline'}`}
                                    style={{ flex: 1 }}
                                    onClick={() => setBookingType('acres')}
                                >
                                    By Acres
                                </button>
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">
                                {bookingType === 'hours' ? 'Estimated Hours Needed' : 'Estimated Land Area (Acres)'}
                            </label>
                            <input
                                type="number"
                                className="input-field"
                                placeholder={bookingType === 'hours' ? 'e.g., 4 hrs' : 'e.g., 2 acres'}
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                            />
                        </div>

                        <button
                            className="btn btn-primary w-full"
                            onClick={() => setStep(2)}
                            disabled={!duration || duration <= 0}
                        >
                            Continue to Payment
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="flex flex-col gap-md">
                        <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                            <h4>Booking Summary</h4>
                            <div className="flex justify-between" style={{ marginTop: '0.5rem' }}>
                                <span>Rate</span>
                                <span>{bookingType === 'hours' ? `₹${equipment.priceHr}/hr` : `₹${equipment.priceAcre}/acre`}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>{bookingType === 'hours' ? 'Estimated Time' : 'Total Land Area'}</span>
                                <span>{duration} {bookingType === 'hours' ? (duration === '1' ? 'hr' : 'hrs') : (duration === '1' ? 'acre' : 'acres')}</span>
                            </div>
                            {isUrgent && (
                                <div className="flex justify-between" style={{ marginTop: '0.2rem', color: '#d32f2f', fontWeight: 'bold' }}>
                                    <span>Urgent Booking Fee</span>
                                    <span>₹500</span>
                                </div>
                            )}
                            <div className="flex justify-between" style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed #ccc', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                <span>Total Amount</span>
                                <span style={{ color: 'var(--primary-color)' }}>₹{totalAmount}</span>
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Payment Method</label>
                            <div className="flex gap-sm">
                                <button className={`btn ${paymentMethod === 'cash' ? 'btn-primary' : 'btn-outline'}`} style={{ flex: 1 }} onClick={() => setPaymentMethod('cash')}>💵 Cash on Delivery</button>
                                <button className={`btn ${paymentMethod === 'online' ? 'btn-primary' : 'btn-outline'}`} style={{ flex: 1 }} onClick={() => setPaymentMethod('online')}>💳 Pay Online</button>
                            </div>
                        </div>

                        {paymentMethod === 'cash' ? (
                            <button className="btn btn-primary w-full" onClick={() => {
                                if (window.confirm('✅ Booking Confirmed!\n\nPay cash to the owner on arrival.')) {
                                    onBack();
                                } else {
                                    onBack();
                                }
                            }}>
                                Confirm Booking (Cash on Delivery)
                            </button>
                        ) : (
                            <button className="btn w-full" style={{ background: '#3399cc', color: 'white', fontWeight: 'bold' }} onClick={handleRazorpay}>
                                💳 Pay ₹{totalAmount} with Razorpay
                            </button>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
}
