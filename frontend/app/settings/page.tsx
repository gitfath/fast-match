"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { translations } from '../../utils/translations';
import { API_BASE_URL } from '../config';

export default function Settings() {
    const router = useRouter();
    const [language, setLanguage] = React.useState('Français');
    const [showLanguageModal, setShowLanguageModal] = React.useState(false);
    const [isAdmin, setIsAdmin] = React.useState(false);

    // Load saved language or default to 'Français'
    React.useEffect(() => {
        const savedLang = localStorage.getItem('app_language');
        if (savedLang) setLanguage(savedLang);

        const userRole = localStorage.getItem('userRole');
        if (userRole === 'ADMIN') setIsAdmin(true);
    }, []);

    const t = translations[language] || translations['Français'];

    const handleLanguageChange = (lang: string) => {
        setLanguage(lang);
        localStorage.setItem('app_language', lang);
        setShowLanguageModal(false);
        // Force reload to apply language changes globally if needed, 
        // but for now local state update is enough for this page.
        // window.location.reload(); 
    };

    const handleDeleteAccount = async () => {
        if (!confirm(`${t['delete_account_confirm_desc']}`)) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/profiles`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                alert(t['delete_account_success']);
                localStorage.clear();
                router.push('/');
            } else {
                alert(t['delete_account_error']);
            }
        } catch (err) {
            console.error(err);
            alert(t['delete_account_error']);
        }
    };

    return (
        <main style={{ background: '#f8f9fa', minHeight: '100vh', padding: '20px', direction: language === 'العربية' ? 'rtl' : 'ltr' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                <button onClick={() => router.back()} style={{ border: 'none', background: 'none', fontSize: '1.5rem', [language === 'العربية' ? 'marginLeft' : 'marginRight']: '15px', transform: language === 'العربية' ? 'rotate(180deg)' : 'none' }}>⬅️</button>
                <h1 className="font-heading" style={{ fontSize: '1.8rem', margin: 0 }}>{t['settings_title']}</h1>
            </div>

            {/* Admin Section */}
            {isAdmin && (
                <>
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', [language === 'العربية' ? 'marginRight' : 'marginLeft']: '10px' }}>
                        Administration
                    </h3>
                    <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(255, 71, 87, 0.1)', marginBottom: '20px', border: '1px solid var(--primary)' }}>
                        <SettingItem label="Accéder au Dashboard Admin" onClick={() => router.push('/admin')} isRtl={language === 'العربية'} />
                    </div>
                </>
            )}



            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', [language === 'العربية' ? 'marginRight' : 'marginLeft']: '10px' }}>
                {t['account_section']}
            </h3>
            <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
                <SettingItem label={t['modify_account']} onClick={() => router.push('/profile-setup')} isRtl={language === 'العربية'} />
                <SettingItem label={t['notifications']} value={t['notifications_status']} onClick={() => alert("Gestion des notifications bientôt disponible !")} isRtl={language === 'العربية'} />
            </div>

            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', [language === 'العربية' ? 'marginRight' : 'marginLeft']: '10px' }}>
                {t['app_section']}
            </h3>
            <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
                <SettingItem label={t['language']} value={language} onClick={() => setShowLanguageModal(true)} isRtl={language === 'العربية'} />
            </div>

            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', [language === 'العربية' ? 'marginRight' : 'marginLeft']: '10px' }}>
                {t['discovery_section']}
            </h3>
            <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
                <SettingItem label={t['location']} value="Lomé, Togo" onClick={() => alert("Changement de localisation (Premium) bientôt disponible !")} isRtl={language === 'العربية'} />
                <SettingItem label={t['distance_max']} value="50 km" onClick={() => alert("Réglage de la distance bientôt disponible !")} isRtl={language === 'العربية'} />
            </div>

            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', [language === 'العربية' ? 'marginRight' : 'marginLeft']: '10px' }}>
                {t['help_section']}
            </h3>
            <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                <SettingItem label={t['help_ia']} onClick={() => router.push('/assistant')} isRtl={language === 'العربية'} />
                <SettingItem label={t['security']} onClick={() => router.push('/legal/securite')} isRtl={language === 'العربية'} />
                <SettingItem label={t['legal_mentions']} onClick={() => router.push('/legal/mentions-legales')} isRtl={language === 'العربية'} />
                <SettingItem label={t['privacy_policy']} onClick={() => router.push('/legal/confidentialite')} isRtl={language === 'العربية'} />
                <SettingItem label={t['terms_conditions']} onClick={() => router.push('/legal/cgu')} isRtl={language === 'العربية'} />
            </div>

            <button
                onClick={() => {
                    localStorage.clear();
                    router.push('/');
                }}
                style={{
                    width: '100%', padding: '15px',
                    background: 'white', color: '#ff4444', border: '1px solid #ddd',
                    borderRadius: '12px', fontWeight: 700, cursor: 'pointer',
                    fontSize: '1rem',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                }}
            >
                {t['logout']}
            </button>

            <button
                onClick={handleDeleteAccount}
                style={{
                    width: '100%', padding: '15px', marginTop: '15px',
                    background: 'none', color: '#999', border: 'none',
                    fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem',
                    textDecoration: 'underline'
                }}
            >
                {t['delete_account']}
            </button>

            <div style={{ textAlign: 'center', marginTop: '30px', color: '#ccc', fontSize: '0.8rem' }}>
                {t['version']} 1.0.0
            </div>

            {/* Language Modal */}
            {showLanguageModal && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} onClick={() => setShowLanguageModal(false)}>
                    <div style={{ width: '85%', maxWidth: '320px', background: 'white', borderRadius: '24px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
                        <h3 className="font-heading" style={{ marginTop: 0, marginBottom: '20px', textAlign: 'center', fontSize: '1.2rem' }}>{t['choose_language']}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {['Français', 'English', 'العربية'].map(lang => (
                                <button
                                    key={lang}
                                    onClick={() => handleLanguageChange(lang)}
                                    style={{
                                        padding: '16px', borderRadius: '16px',
                                        border: language === lang ? '2px solid black' : '1px solid #f0f0f0',
                                        background: language === lang ? '#f8f9fa' : 'white',
                                        fontWeight: language === lang ? 700 : 500,
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        fontFamily: lang === 'العربية' ? 'Arial, sans-serif' : 'inherit',
                                        flexDirection: language === 'العربية' ? 'row-reverse' : 'row'
                                    }}
                                >
                                    <span>{lang}</span>
                                    {language === lang && <span>✓</span>}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowLanguageModal(false)}
                            style={{ marginTop: '20px', width: '100%', padding: '12px', border: 'none', background: 'transparent', color: '#666', fontWeight: 600, cursor: 'pointer' }}>
                            {t['cancel']}
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}

const SettingItem = ({ label, value, onClick, isRtl }: { label: string, value?: string, onClick?: () => void, isRtl?: boolean }) => (
    <div
        onClick={onClick}
        style={{
            padding: '15px 20px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s',
            flexDirection: isRtl ? 'row-reverse' : 'row'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
    >
        <span style={{ fontSize: '1rem', fontWeight: 500, color: '#333' }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
            {value && <span style={{ fontSize: '0.9rem', color: '#999' }}>{value}</span>}
            <span style={{ color: '#ccc', transform: isRtl ? 'rotate(180deg)' : 'none' }}>›</span>
        </div>
    </div>
);
