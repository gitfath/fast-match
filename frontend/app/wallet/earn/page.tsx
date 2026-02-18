"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../config';
import { translations } from '../../../utils/translations';

export default function EarnScreen() {
    const router = useRouter();
    const [referralCode, setReferralCode] = useState('MARIE123'); // Fallback
    const [stats, setStats] = useState({ invited: 3, earned: 1500 });
    const [language, setLanguage] = useState('Français');

    useEffect(() => {
        const savedLang = localStorage.getItem('app_language');
        if (savedLang) setLanguage(savedLang);

        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await fetch(`${API_BASE_URL}/profiles/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.referralCode) setReferralCode(data.referralCode);
                }
            } catch (e) { console.error(e); }
        };
        fetchUserData();
    }, []);

    const t = translations[language] || translations['Français'];
    const isRtl = language === 'العربية';

    const shareCode = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Rejoins-moi sur Fast Match !',
                text: `Utilise mon code ${referralCode} pour gagner des bonus dès ton inscription.`,
                url: window.location.origin
            });
        } else {
            alert(`Mon code: ${referralCode}`);
        }
    };

    return (
        <main style={{ minHeight: '100vh', background: '#F8F9FA', padding: '20px', direction: isRtl ? 'rtl' : 'ltr' }}>
            <header style={{ display: 'flex', alignItems: 'center', marginBottom: '25px', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', [isRtl ? 'marginLeft' : 'marginRight']: '15px', transform: isRtl ? 'scaleX(-1)' : 'none' }}>←</button>
                <h1 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>{t['earn_title']}</h1>
            </header>

            <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '24px',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                marginBottom: '25px'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎁</div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 10px' }}>{t['refer_friends']}</h2>
                <div style={{
                    background: '#F1F5F9',
                    padding: '15px',
                    borderRadius: '12px',
                    margin: '15px 0',
                    border: '2px dashed #CBD5E1'
                }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '5px' }}>{t['referral_code_label']}</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', letterSpacing: '2px' }}>{referralCode}</div>
                </div>
                <button
                    onClick={shareCode}
                    style={{
                        width: '100%',
                        padding: '15px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'var(--primary)',
                        color: 'white',
                        fontWeight: 700,
                        cursor: 'pointer',
                        marginBottom: '15px'
                    }}>
                    {t['share_code_btn']}
                </button>
                <div style={{ fontSize: '0.9rem', color: '#64748B', direction: isRtl ? 'rtl' : 'ltr' }}>
                    {t['invited_stats']}: <strong>{stats.invited}</strong> · {t['total_earned_stats']}: <strong>{stats.earned} FCFA</strong>
                </div>
            </div>

            <section style={{ marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '15px', color: '#64748B', textAlign: isRtl ? 'right' : 'left' }}>{t['daily_actions']}</h3>
                <div style={{
                    background: 'white', padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                            <span style={{ fontWeight: 600 }}>{t['daily_login']}</span>
                            <span style={{ color: 'var(--secondary)', fontWeight: 700, direction: 'ltr' }}>+50 pts</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '10px', textAlign: isRtl ? 'right' : 'left' }}>7/7 jours → Bonus spécial</div>
                        <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: '57%', height: '100%', background: 'var(--secondary)' }}></div>
                        </div>
                        <div style={{ fontSize: '0.75rem', marginTop: '5px', textAlign: isRtl ? 'left' : 'right', color: '#64748B' }}>4/7 {t['days'] || 'jours'}</div>
                    </div>
                </div>
            </section>

            <section style={{ marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '15px', color: '#64748B', textAlign: isRtl ? 'right' : 'left' }}>{t['special_missions']}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{
                        background: 'white', padding: '15px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '15px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                        flexDirection: isRtl ? 'row-reverse' : 'row'
                    }}>
                        <div style={{ fontSize: '1.5rem' }}>🔥</div>
                        <div style={{ flex: 1, textAlign: isRtl ? 'right' : 'left' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{t['match_week']}</div>
                            <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Nouveau match → +10 points</div>
                        </div>
                        <div style={{ color: '#94A3B8' }}>[ ]</div>
                    </div>

                    <div style={{
                        background: 'white', padding: '15px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '15px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                        flexDirection: isRtl ? 'row-reverse' : 'row'
                    }}>
                        <div style={{ fontSize: '1.5rem' }}>👤</div>
                        <div style={{ flex: 1, textAlign: isRtl ? 'right' : 'left' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{t['complete_profile']}</div>
                            <div style={{ fontSize: '0.85rem', color: '#64748B', direction: 'ltr' }}>+100 points</div>
                        </div>
                        <div style={{ color: 'var(--primary)', fontWeight: 800 }}>✓</div>
                    </div>
                </div>
            </section>
        </main>
    );
}
