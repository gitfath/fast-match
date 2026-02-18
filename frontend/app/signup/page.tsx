"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../config';
import { translations } from '../../utils/translations';

export default function Signup() {
    const router = useRouter();
    const [accountType, setAccountType] = useState<'member' | 'partner' | null>(null);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '', // Used for User Name or Business Name
        phone: '',
        birthDate: '',
        gender: '',
        // Partner fields
        businessType: 'Restaurant',
        city: 'Lomé',
        neighborhood: '',
        mapsUrl: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [language, setLanguage] = useState('Français');

    useEffect(() => {
        const savedLang = localStorage.getItem('app_language');
        if (savedLang) setLanguage(savedLang);
    }, []);

    const t = translations[language] || translations['Français'];
    const isRtl = language === 'العربية';

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateStep1 = () => {
        if (!formData.email) {
            setError(t['email_required']);
            return false;
        }
        if (!validateEmail(formData.email)) {
            setError(t['email_invalid']);
            return false;
        }
        if (!formData.password || formData.password.length < 8) {
            setError(t['password_length_error']);
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep1()) {
            setStep(2);
            setError('');
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Common validations
        if (!formData.name) {
            setError(accountType === 'partner' ? t['partner_name_required'] : t['name_required']);
            setLoading(false);
            return;
        }
        if (!formData.phone) {
            setError(t['phone_required']);
            setLoading(false);
            return;
        }

        // Specific validations
        if (accountType === 'member') {
            if (!formData.birthDate) {
                setError(t['dob_required']);
                setLoading(false);
                return;
            }
            if (!formData.gender) {
                setError(t['gender_required']);
                setLoading(false);
                return;
            }
        } else if (accountType === 'partner') {
            if (!formData.city) {
                setError(t['city_required']);
                setLoading(false);
                return;
            }
            if (!formData.businessType) {
                setError(t['business_type_required']);
                setLoading(false);
                return;
            }
        }

        try {
            const payload = accountType === 'partner' ? {
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                role: 'PARTNER',
                name: formData.name,
                type: formData.businessType,
                city: formData.city,
                neighborhood: formData.neighborhood,
                mapsUrl: formData.mapsUrl
            } : {
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                role: 'MEMBER',
                name: formData.name,
                birthDate: formData.birthDate,
                gender: formData.gender
            };

            const res = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('userName', formData.name);
                localStorage.setItem('userRole', data.user.role || (accountType === 'partner' ? 'PARTNER' : 'MEMBER'));

                if (accountType === 'partner') {
                    router.push('/business/dashboard'); // Redirect to business dashboard
                } else {
                    router.push('/profile-setup');
                }
            } else {
                const msg = data.message || data.error || 'Erreur inconnue';
                setError(msg);
            }
        } catch (err) {
            const msg = (err as Error).message || 'Erreur réseau';
            setError(`${t['server_connection_error']}: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    if (!accountType) {
        return (
            <main style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--background)',
                padding: '1rem',
                direction: isRtl ? 'rtl' : 'ltr'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '800px',
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    <h1 className="font-heading" style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--text-main)' }}>
                        {t['welcome_fastmatch']}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.2rem' }}>
                        {t['choose_account_type']}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <button
                            onClick={() => setAccountType('member')}
                            className="choice-card"
                            style={{
                                background: 'white',
                                padding: '2rem',
                                borderRadius: '24px',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                boxShadow: 'var(--shadow-md)'
                            }}
                        >
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👋</div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>{t['member']}</h2>
                            <p style={{ color: '#666', lineHeight: 1.6 }}>
                                {t['member_desc']}
                            </p>
                        </button>

                        <button
                            onClick={() => setAccountType('partner')}
                            className="choice-card"
                            style={{
                                background: 'white',
                                padding: '2rem',
                                borderRadius: '24px',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                boxShadow: 'var(--shadow-md)'
                            }}
                        >
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏢</div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>{t['partner']}</h2>
                            <p style={{ color: '#666', lineHeight: 1.6 }}>
                                {t['partner_desc']}
                            </p>
                        </button>
                    </div>

                    <div style={{ marginTop: '3rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{t['already_account']}</span>
                        <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', marginLeft: '5px', marginRight: '5px' }}>
                            {t['login_btn']}
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--background)',
            padding: '1rem',
            direction: isRtl ? 'rtl' : 'ltr'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '420px',
                padding: '2rem',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '32px',
                boxShadow: 'var(--shadow-premium)'
            }}>
                <button
                    onClick={() => { setAccountType(null); setStep(1); setError(''); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', marginBottom: '1rem', transform: isRtl ? 'scaleX(-1)' : 'none' }}
                >
                    ←
                </button>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                        {accountType === 'partner' ? '🏢' : '🚀'}
                    </div>
                    <h1 className="font-heading" style={{ fontSize: '2rem', color: 'var(--text-main)', margin: 0 }}>
                        {accountType === 'partner' ? t['partner_space'] : t['signup']}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                        {accountType === 'partner' ? t['register_business'] : t['join_fastmatch']}
                    </p>
                </div>

                <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {error && (
                        <div style={{
                            color: '#e74c3c',
                            fontSize: '0.9rem',
                            textAlign: 'center',
                            padding: '0.8rem',
                            background: '#fdecea',
                            borderRadius: '12px',
                            fontWeight: 600
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="animate-slide-up">
                            <label className="label">{t['email']}</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="input-field"
                                placeholder="exemple@email.com"
                                autoFocus
                            />

                            <label className="label" style={{ marginTop: '1rem' }}>{t['password_min_8']}</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="input-field"
                                placeholder="••••••••"
                            />

                            <button
                                type="button"
                                onClick={handleNext}
                                className="btn btn-primary"
                                style={{ marginTop: '2rem', width: '100%' }}
                            >
                                {t['continue']}
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-slide-up">
                            {accountType === 'partner' ? (
                                <>
                                    <label className="label">{t['business_name']}</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-field"
                                        placeholder="Ex: Le Patio"
                                        autoFocus
                                    />

                                    <label className="label" style={{ marginTop: '1rem' }}>{t['type']}</label>
                                    <select
                                        value={formData.businessType}
                                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                                        className="input-field"
                                        style={{ background: 'white' }}
                                    >
                                        <option value="Restaurant">Restaurant</option>
                                        <option value="Bar">Bar</option>
                                        <option value="Club">Club / Discothèque</option>
                                        <option value="Cinema">Cinéma</option>
                                        <option value="Café">Café</option>
                                        <option value="Loisirs">Loisirs & Détente</option>
                                        <option value="Autre">Autre</option>
                                    </select>

                                    <label className="label" style={{ marginTop: '1rem' }}>{t['city']}</label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="input-field"
                                        placeholder="Ex: Lomé"
                                    />

                                    <label className="label" style={{ marginTop: '1rem' }}>{t['neighborhood']}</label>
                                    <input
                                        type="text"
                                        value={formData.neighborhood}
                                        onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                                        className="input-field"
                                        placeholder="Ex: Nukafu"
                                    />

                                    <label className="label" style={{ marginTop: '1rem' }}>{t['maps_optional']}</label>
                                    <input
                                        type="url"
                                        value={formData.mapsUrl}
                                        onChange={(e) => setFormData({ ...formData, mapsUrl: e.target.value })}
                                        className="input-field"
                                        placeholder="https://maps.app.goo.gl/..."
                                    />

                                    <label className="label" style={{ marginTop: '1rem' }}>{t['contact_phone']}</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="input-field"
                                        placeholder="+228 90 00 00 00"
                                    />
                                </>
                            ) : (
                                <>
                                    <label className="label">{t['your_name']}</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-field"
                                        placeholder="Prénom"
                                        autoFocus
                                    />

                                    <label className="label" style={{ marginTop: '1rem' }}>{t['dob']}</label>
                                    <input
                                        type="date"
                                        value={formData.birthDate || ''}
                                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                        className="input-field"
                                    />

                                    <label className="label" style={{ marginTop: '1rem' }}>{t['gender']}</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        {[t['male'], t['female'], t['other']].map(g => (
                                            <button
                                                key={g}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, gender: g })}
                                                style={{
                                                    padding: '0.8rem',
                                                    borderRadius: '12px',
                                                    border: formData.gender === g ? '2px solid var(--primary)' : '2px solid #f0f0f0',
                                                    background: formData.gender === g ? 'var(--accent-light)' : 'white',
                                                    color: formData.gender === g ? 'var(--primary)' : '#666',
                                                    fontWeight: 600,
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>

                                    <label className="label" style={{ marginTop: '1rem' }}>{t['phone_number']}</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="input-field"
                                        placeholder="+228 90 00 00 00"
                                    />
                                </>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary"
                                style={{ marginTop: '2rem', width: '100%', opacity: loading ? 0.7 : 1 }}
                            >
                                {loading ? t['creating'] : (accountType === 'partner' ? t['create_business_btn'] : t['create_account_btn'])}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                style={{
                                    marginTop: '1rem',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    padding: '1rem',
                                    width: '100%'
                                }}
                            >
                                {t['back_btn']}
                            </button>
                        </div>
                    )}
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{t['already_registered']}</span>
                    <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', marginLeft: '5px', marginRight: '5px' }}>
                        {t['login_btn']}
                    </Link>
                </div>
            </div>
            <style jsx>{`
                .label {
                    display: block;
                    font-size: 0.9rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                    color: var(--text-main);
                    padding-left: 4px;
                }
                .animate-slide-up {
                    animation: slideUp 0.4s ease-out;
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .choice-card:hover {
                    transform: translateY(-5px);
                }
            `}</style>
        </main>
    );
}
