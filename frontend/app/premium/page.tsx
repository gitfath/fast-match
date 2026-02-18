"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../config';
import { translations } from '../../utils/translations';

export default function Premium() {
    const router = useRouter();
    const [selectedPlan, setSelectedPlan] = useState('6_months');
    const [loading, setLoading] = useState(false);
    const [showPaymentOptions, setShowPaymentOptions] = useState(false);
    const [language, setLanguage] = useState('Français');

    useEffect(() => {
        const savedLang = localStorage.getItem('app_language');
        if (savedLang) setLanguage(savedLang);
    }, []);

    const t = translations[language] || translations['Français'];

    const getPlanDetails = () => {
        switch (selectedPlan) {
            case '1_month': return { amount: 5000, label: t['premium_1_month'] };
            case '6_months': return { amount: 15000, label: t['premium_6_months'] };
            case '12_months': return { amount: 24000, label: t['premium_12_months'] };
            default: return { amount: 5000, label: 'Premium' };
        }
    };

    const handlePurchaseClick = () => {
        setShowPaymentOptions(true);
    };

    const processPayment = async (method: 'MOBILE_MONEY' | 'CARD') => {
        setLoading(true);
        setShowPaymentOptions(false);
        const plan = getPlanDetails();
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/payments/initiate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: plan.amount,
                    description: `Abonnement Fast Match Gold - ${plan.label}`,
                    network: method === 'CARD' ? 'CARD' : undefined
                })
            });

            const data = await response.json();

            if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else {
                alert('Erreur: ' + (data.error || 'Inconnue'));
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            alert('Erreur de connexion');
            setLoading(false);
        }
    };

    const isRtl = language === 'العربية';

    return (
        <main style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1c1c1c 0%, #3a3a3a 100%)',
            color: 'white',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            direction: isRtl ? 'rtl' : 'ltr'
        }}>
            <button
                onClick={() => router.push('/profile')}
                style={{
                    alignSelf: isRtl ? 'flex-end' : 'flex-start',
                    background: 'rgba(255,255,255,0.2)', border: 'none',
                    color: 'white', width: '40px', height: '40px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    marginBottom: '20px'
                }}
            >
                ✕
            </button>

            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{ fontSize: '4rem', marginBottom: '10px' }}>✨</div>
                <h1 className="font-premium" style={{ fontSize: '2.8rem', margin: '0 0 10px', background: 'linear-gradient(to right, #FFD700, #FDB931)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'italic' }}>
                    {t['premium_title']}
                </h1>
                <p style={{ fontSize: '1.2rem', opacity: 0.9, fontFamily: "'Playfair Display', serif" }}>{t['premium_subtitle']}</p>
            </div>

            {/* Features Carousel */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                <Feature icon="❤️" title={t['feature_unlimited_likes']} desc={t['feature_unlimited_likes_desc']} isRtl={isRtl} />
                <Feature icon="⚡" title={t['feature_super_likes']} desc={t['feature_super_likes_desc']} isRtl={isRtl} />
                <Feature icon="⏪" title={t['feature_rewind']} desc={t['feature_rewind_desc']} isRtl={isRtl} />
                <Feature icon="🌍" title={t['feature_passport']} desc={t['feature_passport_desc']} isRtl={isRtl} />
            </div>

            {/* Plans */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '30px', direction: 'ltr' }}>
                <Plan
                    duration={`1 ${t['month']}`} price="5000 F" label=""
                    selected={selectedPlan === '1_month'} onClick={() => setSelectedPlan('1_month')}
                />
                <Plan
                    duration={`6 ${t['month']}`} price="2500 F/m" label={t['popular']} isPopular
                    selected={selectedPlan === '6_months'} onClick={() => setSelectedPlan('6_months')}
                />
                <Plan
                    duration={`12 ${t['month']}`} price="2000 F/m" label="-60%"
                    selected={selectedPlan === '12_months'} onClick={() => setSelectedPlan('12_months')}
                />
            </div>

            <button
                onClick={handlePurchaseClick}
                disabled={loading}
                className="font-premium"
                style={{
                    width: '100%', padding: '18px', borderRadius: '16px', border: 'none',
                    background: 'linear-gradient(to right, #FFD700, #FDB931)',
                    color: '#5a4a00', fontSize: '1.2rem', fontWeight: 800,
                    boxShadow: '0 10px 30px rgba(253, 185, 49, 0.4)',
                    cursor: loading ? 'wait' : 'pointer',
                    transform: 'scale(1)',
                    transition: 'transform 0.2s',
                    marginTop: 'auto',
                    letterSpacing: '1px',
                    opacity: loading ? 0.7 : 1
                }}
            >
                {loading ? (t['loading'] || 'Loading...').toUpperCase() : t['continue']}
            </button>

            <button
                onClick={() => router.push('/profile')}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.6)',
                    padding: '15px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: '10px',
                    width: '100%'
                }}
            >
                {t['not_now']}
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.7rem', opacity: 0.5, marginTop: '15px' }}>
                {t['secure_payment_info']}
            </p>

            {/* Payment Modal */}
            {showPaymentOptions && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 100,
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'end',
                    direction: isRtl ? 'rtl' : 'ltr'
                }}>
                    <div style={{
                        width: '100%', background: '#222', borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
                        padding: '30px 20px 50px',
                        animation: 'slideUp 0.3s ease-out'
                    }}>
                        <h3 className="font-premium" style={{ fontSize: '1.5rem', marginBottom: '20px', textAlign: 'center' }}>
                            {t['payment_method_title']}
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <button
                                onClick={() => processPayment('MOBILE_MONEY')}
                                style={{
                                    padding: '18px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)',
                                    background: '#333', color: 'white', fontSize: '1rem', fontWeight: 600,
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                }}
                            >
                                <span>{t['pay_mobile_money']}</span>
                                <span>{isRtl ? '⬅️' : '➡️'}</span>
                            </button>

                            <button
                                onClick={() => processPayment('CARD')}
                                style={{
                                    padding: '18px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)',
                                    background: '#333', color: 'white', fontSize: '1rem', fontWeight: 600,
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                }}
                            >
                                <span>{t['pay_card']}</span>
                                <span>{isRtl ? '⬅️' : '➡️'}</span>
                            </button>
                        </div>

                        <button
                            onClick={() => setShowPaymentOptions(false)}
                            style={{
                                width: '100%', padding: '15px', marginTop: '20px',
                                background: 'transparent', border: 'none', color: '#999'
                            }}
                        >
                            {t['cancel']}
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
            `}</style>
        </main>
    );
}

const Feature = ({ icon, title, desc, isRtl }: any) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 0', flexDirection: isRtl ? 'row-reverse' : 'row', textAlign: isRtl ? 'right' : 'left' }}>
        <div style={{ fontSize: '1.8rem' }}>{icon}</div>
        <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{title}</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7 }}>{desc}</p>
        </div>
    </div>
);

const Plan = ({ duration, price, label, isPopular, selected, onClick }: any) => (
    <div
        onClick={onClick}
        style={{
            background: selected ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255,255,255,0.05)',
            border: selected ? '2px solid #FFD700' : '2px solid transparent',
            borderRadius: '16px', padding: '15px 5px', textAlign: 'center',
            position: 'relative', cursor: 'pointer', transition: 'all 0.2s'
        }}
    >
        {label && (
            <span style={{
                position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                background: isPopular ? '#FFD700' : '#333', color: isPopular ? '#5a4a00' : 'white',
                fontSize: '0.65rem', fontWeight: 800, padding: '4px 8px', borderRadius: '10px',
                whiteSpace: 'nowrap'
            }}>
                {label}
            </span>
        )}
        <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '5px' }}>{duration}</div>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFD700', marginTop: '10px' }}>{price}</div>
    </div>
);
