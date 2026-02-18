"use client";
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../app/config';
import { translations } from '../../utils/translations';

interface WithdrawModalProps {
    balance: number;
    onClose: () => void;
    onSuccess: () => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ balance, onClose, onSuccess }) => {
    const [provider, setProvider] = useState('Moov Money');
    const [phone, setPhone] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [language, setLanguage] = useState('Français');

    useEffect(() => {
        const savedLang = localStorage.getItem('app_language');
        if (savedLang) setLanguage(savedLang);
    }, []);

    const t = translations[language] || translations['Français'];
    const isRtl = language === 'العربية';

    const handleSubmit = async () => {
        setError(null);
        const amt = parseFloat(amount);

        if (!phone || phone.length < 8) {
            setError(t['error_phone']);
            return;
        }

        if (isNaN(amt) || amt < 5000) {
            setError(t['error_min_amount']);
            return;
        }

        if (amt > balance) {
            setError(t['error_insufficient_balance']);
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/monetization/withdraw`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount: amt, provider, phone })
            });

            if (res.ok) {
                onSuccess();
            } else {
                const data = await res.json();
                setError(data.error || 'Une erreur est survenue');
            }
        } catch (e) {
            setError(t['error_connection']);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)', zIndex: 1000,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            direction: isRtl ? 'rtl' : 'ltr'
        }} onClick={onClose}>
            <div style={{
                background: 'white',
                width: '100%',
                maxWidth: '500px',
                borderTopLeftRadius: '30px',
                borderTopRightRadius: '30px',
                padding: '30px',
                paddingBottom: '50px',
                animation: 'slideUp 0.3s ease-out'
            }} onClick={e => e.stopPropagation()}>
                <div style={{ width: '40px', height: '5px', background: '#EEE', borderRadius: '10px', margin: '0 auto 20px' }}></div>

                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 10px', textAlign: 'center' }}>{t['withdraw_modal_title']}</h2>
                <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                    <div style={{ fontSize: '0.9rem', color: '#64748B', direction: 'ltr' }}>{t['available_balance']}: <strong>{balance.toLocaleString()} FCFA</strong></div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{t['min_withdraw']}</div>
                </div>

                {error && (
                    <div style={{ background: '#FEE2E2', color: '#EF4444', padding: '12px', borderRadius: '12px', textAlign: 'center', marginBottom: '20px', fontSize: '0.9rem', fontWeight: 600 }}>
                        ⚠️ {error}
                    </div>
                )}

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '10px' }}>{t['operator']}</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {['TMoney', 'Moov Money'].map(op => (
                            <button
                                key={op}
                                onClick={() => setProvider(op)}
                                style={{
                                    flex: 1, padding: '12px', borderRadius: '12px', border: provider === op ? '2px solid var(--primary)' : '1px solid #EEE',
                                    background: provider === op ? '#FFF5F2' : 'white', color: provider === op ? 'var(--primary)' : '#64748B',
                                    fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                                }}>
                                {op === 'TMoney' ? '🇹 Togocom' : 'Ⓜ️ Moov'}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '10px' }}>{t['mobile_money_number']}</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="Ex: 90123456"
                        style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #EEE', fontSize: '1rem', textAlign: isRtl ? 'right' : 'left' }}
                    />
                </div>

                <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '10px' }}>{t['amount_fcfa']}</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="Min. 5000"
                        style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #EEE', fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)', textAlign: isRtl ? 'right' : 'left' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.8rem', color: '#94A3B8', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                        <span>{t['fees']}</span>
                        <span style={{ direction: 'ltr' }}>{t['you_receive']} {amount ? (parseFloat(amount) || 0).toLocaleString() : 0} FCFA</span>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                        width: '100%', padding: '18px', borderRadius: '16px', border: 'none',
                        background: 'var(--primary)', color: 'white', fontWeight: 800,
                        fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(255,107,53,0.3)',
                        opacity: loading ? 0.7 : 1
                    }}>
                    {loading ? t['processing'] : t['confirm_withdraw']}
                </button>
            </div>

            <style jsx>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};
