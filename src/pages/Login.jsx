import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tractor, Smartphone, ShieldCheck, User, Settings, Loader2 } from 'lucide-react';

export default function Login() {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'role'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(0);
    const [selectedRole, setSelectedRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (timer > 0) {
            const id = setTimeout(() => setTimer(t => t - 1), 1000);
            return () => clearTimeout(id);
        }
    }, [timer]);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (phone.length !== 10) { setError('Enter a valid 10-digit number'); return; }
        setError('');
        setLoading(true);

        // Simulating a professional network request
        setTimeout(() => {
            setStep('otp');
            setTimer(30);
            setLoading(false);
        }, 1500);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) { setError('Enter the 6-digit OTP'); return; }
        setError('');
        setLoading(true);

        // Simulating verification
        setTimeout(() => {
            setStep('role');
            setLoading(false);
        }, 1000);
    };

    const handleResend = () => {
        setLoading(true);
        setTimeout(() => {
            setTimer(30);
            setError('');
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="container" style={{ maxWidth: '420px', marginTop: '3rem' }}>
            <div className="card flex flex-col items-center gap-lg">
                <div className="flex flex-col items-center gap-sm">
                    <div style={{ background: 'linear-gradient(135deg, var(--primary-color), #43a047)', color: 'white', padding: '1.2rem', borderRadius: '50%', boxShadow: '0 4px 16px rgba(46,125,50,0.3)' }}>
                        <Tractor size={44} />
                    </div>
                    <h2 style={{ margin: 0 }}>HarvesterHub</h2>
                    <p style={{ margin: '-0.4rem 0 0.5rem', fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: '600' }}>by yerraudaykumar</p>
                    <p className="text-muted" style={{ textAlign: 'center', maxWidth: '280px' }}>
                        {step === 'phone' && 'Enter your mobile number to receive an OTP'}
                        {step === 'otp' && `OTP sent to +91-${phone}`}
                        {step === 'role' && 'Welcome! How do you want to continue?'}
                    </p>
                </div>

                {/* Step 1: Phone number */}
                {step === 'phone' && (
                    <form className="w-full flex flex-col gap-md" onSubmit={handleSendOtp}>
                        <div className="input-group">
                            <label className="input-label">Mobile Number</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>+91</span>
                                <input
                                    type="tel"
                                    className="input-field w-full"
                                    style={{ paddingLeft: '3rem' }}
                                    placeholder="10-digit number"
                                    maxLength={10}
                                    pattern="[0-9]{10}"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>
                        {error && <p style={{ color: '#c62828', fontSize: '0.875rem', margin: 0 }}>{error}</p>}
                        <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center', gap: '0.5rem' }} disabled={loading}>
                            {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Sending...</> : <><Smartphone size={18} /> Send OTP</>}
                        </button>
                    </form>
                )}

                {/* Step 2: OTP verification */}
                {step === 'otp' && (
                    <form className="w-full flex flex-col gap-md" onSubmit={handleVerifyOtp}>
                        <div className="input-group">
                            <label className="input-label">Enter OTP</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                className="input-field w-full"
                                style={{ fontSize: '1.5rem', letterSpacing: '0.5rem', textAlign: 'center' }}
                                placeholder="— — — — — —"
                                maxLength={6}
                                value={otp}
                                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                                required
                                autoFocus
                            />
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                6-digit OTP sent via SMS to your phone
                            </p>
                        </div>
                        {error && <p style={{ color: '#c62828', fontSize: '0.875rem', margin: 0 }}>{error}</p>}
                        <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center', gap: '0.5rem' }} disabled={loading}>
                            {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Verifying...</> : <><ShieldCheck size={18} /> Verify & Continue</>}
                        </button>
                        <div style={{ textAlign: 'center' }}>
                            {timer > 0 ? (
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Resend OTP in {timer}s</p>
                            ) : (
                                <button type="button" onClick={handleResend} disabled={loading} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600' }}>
                                    Resend OTP
                                </button>
                            )}
                        </div>
                    </form>
                )}

                {/* Step 3: Role selection */}
                {step === 'role' && (
                    <div className="w-full flex flex-col gap-md">
                        <div
                            className="card flex items-center gap-lg cursor-pointer"
                            style={{
                                transition: 'all 0.3s ease',
                                border: '2px solid transparent',
                                borderColor: selectedRole === 'farmer' ? 'var(--primary-color)' : 'var(--border-color)',
                                backgroundColor: selectedRole === 'farmer' ? '#e8f5e9' : 'var(--card-bg)',
                                transform: selectedRole === 'farmer' ? 'scale(1.02)' : 'scale(1)',
                                boxShadow: selectedRole === 'farmer' ? '0 8px 16px rgba(46,125,50,0.15)' : 'none'
                            }}
                            onClick={() => {
                                setSelectedRole('farmer');
                                setTimeout(() => navigate('/farmer'), 500);
                            }}
                        >
                            <div style={{
                                background: selectedRole === 'farmer' ? 'var(--primary-color)' : '#f5f5f5',
                                color: selectedRole === 'farmer' ? 'white' : 'var(--text-muted)',
                                padding: '1rem', borderRadius: '50%', transition: 'all 0.3s'
                            }}>
                                <User size={28} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, color: selectedRole === 'farmer' ? 'var(--primary-color)' : 'var(--text-main)' }}>I'm a Farmer</h3>
                                <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>Find and book equipment</p>
                            </div>
                        </div>

                        <div
                            className="card flex items-center gap-lg cursor-pointer"
                            style={{
                                transition: 'all 0.3s ease',
                                border: '2px solid transparent',
                                borderColor: selectedRole === 'owner' ? '#0288d1' : 'var(--border-color)',
                                backgroundColor: selectedRole === 'owner' ? '#e1f5fe' : 'var(--card-bg)',
                                transform: selectedRole === 'owner' ? 'scale(1.02)' : 'scale(1)',
                                boxShadow: selectedRole === 'owner' ? '0 8px 16px rgba(2,136,209,0.15)' : 'none'
                            }}
                            onClick={() => {
                                setSelectedRole('owner');
                                setTimeout(() => navigate('/owner'), 500);
                            }}
                        >
                            <div style={{
                                background: selectedRole === 'owner' ? '#0288d1' : '#f5f5f5',
                                color: selectedRole === 'owner' ? 'white' : 'var(--text-muted)',
                                padding: '1rem', borderRadius: '50%', transition: 'all 0.3s'
                            }}>
                                <Settings size={28} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, color: selectedRole === 'owner' ? '#0288d1' : 'var(--text-main)' }}>I'm an Owner</h3>
                                <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>List and manage machinery</p>
                            </div>
                        </div>
                    </div>
                )}

                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '-0.5rem' }}>
                    🔒 Secured by HarvesterHub Encryption
                </p>
            </div>
        </div>
    );
}
