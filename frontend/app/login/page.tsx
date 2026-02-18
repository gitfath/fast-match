"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../config';
import { translations } from '../../utils/translations';

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [language, setLanguage] = useState('Français');

    useEffect(() => {
        const savedLang = localStorage.getItem('app_language');
        if (savedLang) setLanguage(savedLang);
    }, []);

    const t = translations[language] || translations['Français'];
    const isRtl = language === 'العربية';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                identifier: formData.identifier, // Can be email or pseudo
                password: formData.password
            };

            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.user.id);
                if (data.user.role) localStorage.setItem('userRole', data.user.role);

                if (data.user.role === 'PARTNER') {
                    router.push('/business/dashboard');
                } else {
                    router.push('/feed');
                }
            } else {
                setError(data.message || t['invalid_credentials']);
            }
        } catch (err) {
            setError(t['server_connection_error']);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--background)',
            direction: isRtl ? 'rtl' : 'ltr'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                padding: '2.5rem',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '32px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>👋</div>
                    <h1 className="font-heading" style={{ fontSize: '2rem', color: 'var(--text-main)', margin: 0 }}>{t['welcome_back']}</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t['ready_to_match']}</p>
                </div>

                {/* Google Login Placeholder */}
                <button style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '50px',
                    border: '1px solid #ddd',
                    background: 'white',
                    color: '#333',
                    fontSize: '1rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    marginBottom: '1.5rem',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                    flexDirection: isRtl ? 'row-reverse' : 'row'
                }} onClick={() => alert(t['google_login_soon'])}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" width="20" height="20" alt="Google" />
                    {t['login_google']}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
                    <span style={{ color: '#888', fontSize: '0.8rem', fontWeight: 600 }}>{t['or_classic']}</span>
                    <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {error && (
                        <div style={{
                            color: '#e74c3c',
                            fontSize: '0.85rem',
                            textAlign: 'center',
                            padding: '0.8rem',
                            background: '#fdecea',
                            borderRadius: '12px',
                            fontWeight: 600
                        }}>{error}</div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', paddingLeft: '4px' }}>{t['email_or_username']}</label>
                        <input
                            type="text"
                            required
                            value={formData.identifier}
                            onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                            className="input-field"
                            placeholder={t['placeholder_email_username']}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '4px' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', paddingLeft: '4px' }}>{t['password']}</label>
                            <Link href="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                                {t['forgot_password']}
                            </Link>
                        </div>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="input-field"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ marginTop: '1rem', width: '100%', padding: '1.2rem', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? t['logging_in'] : t['login_btn']}
                    </button>

                    <Link href="/forgot" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center', textDecoration: 'none', display: 'block', marginTop: '0.5rem' }}>{t['forgot_password']}</Link>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{t['new_user']}</span>
                    <Link href="/signup" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', marginLeft: '5px', marginRight: '5px' }}>
                        {t['create_account']}
                    </Link>
                </div>
            </div>
        </main>
    );
}
