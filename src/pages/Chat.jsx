import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, MoreVertical, Check, CheckCheck, User, Tractor, ShieldCheck } from 'lucide-react';

const mockSystemMessages = [
    { id: 1, text: "Wait, I'll check my tractor availability.", time: "10:15 AM", sender: "other" },
    { id: 2, text: "I can bring the Mahindra 575 to your field by 8 AM tomorrow. Is that okay?", time: "10:17 AM", sender: "other" }
];

export default function Chat() {
    const location = useLocation();
    const navigate = useNavigate();
    const [messages, setMessages] = useState(mockSystemMessages);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    const { equipmentName, ownerName, type } = location.state || { equipmentName: 'Equipment', ownerName: 'Owner', type: 'Tractor' };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessage = {
            id: Date.now(),
            text: input.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: 'me',
            status: 'sent'
        };

        setMessages([...messages, newMessage]);
        setInput('');

        // Mock auto-reply logic
        setTimeout(() => {
            setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: 'delivered' } : m));
        }, 1000);

        setTimeout(() => {
            setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: 'read' } : m));
            setIsTyping(true);
        }, 2000);

        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: `Sure, I'll confirm the ${type} for tomorrow. Please proceed with the booking!`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                sender: 'other'
            }]);
        }, 4000);
    };

    return (
        <div className="container" style={{ maxWidth: '600px', height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column', padding: 0, background: 'white', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', marginTop: '1rem' }}>
            {/* Chat Header */}
            <div style={{ padding: '1rem', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem' }}>
                    <ArrowLeft size={20} />
                </button>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.6rem', borderRadius: '50%' }}>
                    <User size={24} />
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: 'white' }}>{ownerName}</h3>
                    <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.9 }}>Discussing {equipmentName}</p>
                </div>
                <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                    <MoreVertical size={20} />
                </button>
            </div>

            {/* Message List */}
            <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', background: '#f0f2f5', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ alignSelf: 'center', background: 'rgba(0,0,0,0.05)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Today
                </div>

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        style={{
                            alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                            maxWidth: '80%',
                            background: msg.sender === 'me' ? '#dcf8c6' : 'white',
                            padding: '0.6rem 1rem',
                            borderRadius: '12px',
                            borderTopRightRadius: msg.sender === 'me' ? '2px' : '12px',
                            borderTopLeftRadius: msg.sender === 'other' ? '2px' : '12px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                            position: 'relative'
                        }}
                    >
                        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)', lineBreak: 'anywhere' }}>{msg.text}</p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.3rem', marginTop: '0.2rem' }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{msg.time}</span>
                            {msg.sender === 'me' && (
                                <span style={{ color: msg.status === 'read' ? '#34b7f1' : '#999' }}>
                                    {msg.status === 'sent' && <Check size={14} />}
                                    {msg.status === 'delivered' && <CheckCheck size={14} />}
                                    {msg.status === 'read' && <CheckCheck size={14} />}
                                </span>
                            )}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div style={{ alignSelf: 'flex-start', background: 'white', padding: '0.6rem 1rem', borderRadius: '12px', borderTopLeftRadius: '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        {ownerName} is typing...
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSend} style={{ padding: '1rem', background: '#f0f2f5', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input
                    type="text"
                    className="input-field"
                    style={{ flex: 1, borderRadius: '24px', border: 'none', padding: '0.75rem 1.25rem' }}
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', borderRadius: '50%', width: '48px', height: '48px', minWidth: '48px' }}>
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
}
