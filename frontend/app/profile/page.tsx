"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BottomNav from '../../components/BottomNav';
import { API_BASE_URL, BACKEND_URL } from '../config';
import TopHeader from '../../components/TopHeader';
import { translations } from '../../utils/translations';

export default function Profile() {
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [language, setLanguage] = useState('Français');

    useEffect(() => {
        console.log("Profile page loaded - v2.1");
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const savedLang = localStorage.getItem('app_language');
        if (savedLang) setLanguage(savedLang);

        fetch(`${API_BASE_URL}/profiles/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setProfile(data))
            .catch(err => console.error(err));
    }, [router]);

    const t = translations[language] || translations['Français'];
    const isRtl = language === 'العربية';

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/');
    };

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !profile) return;

        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('photo', file);

        try {
            const uploadRes = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (uploadRes.ok) {
                const uploadData = await uploadRes.json();
                const newPhotoUrl = uploadData.url;

                const currentPhotos = profile.photos?.map((p: any) => p.url) || [];
                const updatedPhotos = [newPhotoUrl, ...currentPhotos].slice(0, 6);

                const updateRes = await fetch(`${API_BASE_URL}/profiles`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ photos: updatedPhotos })
                });

                if (updateRes.ok) {
                    const updatedProfile = await updateRes.json();
                    setProfile(updatedProfile);
                    alert(t['photo_updated']);
                }
            }
        } catch (err) {
            console.error(err);
            alert(t['upload_error']);
        }
    };

    const getPhotoUrl = (photo: any) => {
        if (!photo) return 'https://via.placeholder.com/150';
        let url = typeof photo === 'string' ? photo : photo.url;
        if (!url) return 'https://via.placeholder.com/150';

        if (url.includes('/uploads/')) {
            const fileName = url.split('/uploads/')[1];
            return `${BACKEND_URL}/uploads/${fileName}`;
        }

        if (url.startsWith('http')) return url;
        if (url.startsWith('uploads')) return `${BACKEND_URL}/${url}`;
        return url;
    };

    if (!profile) return null;

    // Helper for displaying info
    const InfoRow = ({ icon, label, value }: any) => {
        if (!value) return null;
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid #eee', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                <span style={{ fontSize: '1.2rem' }}>{icon}</span>
                <span style={{ fontSize: '0.9rem', color: '#666', flex: 1, textAlign: isRtl ? 'right' : 'left' }}>{label}</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#333' }}>{value}</span>
            </div>
        );
    };

    return (
        <main style={{
            background: 'transparent',
            minHeight: '100vh',
            paddingBottom: '100px',
            paddingTop: '60px',
            direction: isRtl ? 'rtl' : 'ltr'
        }}>
            <TopHeader />

            <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
                style={{ display: 'none' }}
            />

            <div style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', padding: '40px 20px 30px', borderRadius: '0 0 30px 30px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '15px' }}>
                    <div style={{
                        width: '120px', height: '120px', borderRadius: '50%',
                        overflow: 'hidden', border: '4px solid white',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                    }}>
                        <img
                            src={getPhotoUrl(profile.photos?.[0])}
                            alt={profile.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            position: 'absolute', bottom: 0, right: isRtl ? 'auto' : 0, left: isRtl ? 0 : 'auto',
                            background: 'linear-gradient(135deg, #ff6b6b, #ff4757)',
                            color: 'white',
                            width: '36px', height: '36px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '3px solid white', fontSize: '1.5rem', fontWeight: 'bold',
                            cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                            zIndex: 2
                        }}
                        title="Changer de photo"
                    >
                        +
                    </div>
                </div>

                <h1 className="font-heading" style={{ fontSize: '1.8rem', margin: '0 0 5px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {profile.name}
                    {profile.pseudo && (
                        <span>({profile.pseudo})</span>
                    )}
                    {profile.age}
                </h1>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>{profile.city || t['not_specified']}{profile.neighborhood ? ` • ${profile.neighborhood}` : ''}</p>

                {/* Quick Actions */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '25px', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                    <ActionButton icon="⚙️" label={t['settings']} onClick={() => router.push('/settings')} />
                    <div style={{ transform: 'scale(1.2)' }}>
                        <ActionButton icon="✏️" label={t['edit']} active onClick={() => router.push('/profile/edit')} />
                    </div>
                    <ActionButton icon="🛡️" label={t['security']} onClick={() => alert(t['security_soon'])} />
                </div>
            </div>

            <div style={{ padding: '20px' }}>
                {/* Premium Teaser */}
                <div style={{
                    background: 'linear-gradient(135deg, #FFD700 0%, #FDB931 100%)',
                    borderRadius: '20px', padding: '20px', margin: '0 0 20px',
                    color: '#5a4a00',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    boxShadow: '0 8px 20px rgba(253, 185, 49, 0.3)',
                    cursor: 'pointer',
                    flexDirection: isRtl ? 'row-reverse' : 'row',
                    textAlign: isRtl ? 'right' : 'left'
                }} onClick={() => router.push('/premium')}>
                    <div>
                        <h3 style={{ margin: '0 0 5px', fontSize: '1.1rem', fontWeight: 800 }}>{t['upgrade_gold_title']}</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>{t['upgrade_gold_desc']}</p>
                    </div>
                    <div style={{ fontSize: '1.5rem', background: 'rgba(255,255,255,0.3)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isRtl ? '←' : '➜'}
                    </div>
                </div>

                {/* Bio */}
                <h3 className="font-heading" style={{ fontSize: '1.1rem', margin: '0 0 15px', textAlign: isRtl ? 'right' : 'left' }}>{t['bio']}</h3>
                <div className="card-section" style={{ background: 'rgba(255,255,255,0.7)', padding: '20px', borderRadius: '16px', marginBottom: '20px', color: '#555', lineHeight: '1.6', textAlign: isRtl ? 'right' : 'left' }}>
                    {profile.bio || t['no_bio']}
                </div>

                {/* Details Section (Work, Education, etc) */}
                <h3 className="font-heading" style={{ fontSize: '1.1rem', margin: '0 0 15px', textAlign: isRtl ? 'right' : 'left' }}>{t['details']}</h3>
                <div className="card-section" style={{ background: 'white', padding: '15px 20px', borderRadius: '16px', marginBottom: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                    <InfoRow icon="💼" label={t['label_profession']} value={profile.profession} />
                    <InfoRow icon="🎓" label={t['label_education']} value={profile.educationLevel} />
                    <InfoRow icon="📏" label={t['label_height']} value={profile.height} />
                    <InfoRow icon="🚬" label={t['label_smoking']} value={profile.smoking} />
                    <InfoRow icon="🍷" label={t['label_drinking']} value={profile.drinking} />
                    <InfoRow icon="✝️" label={t['label_religion']} value={profile.religion} />
                    <InfoRow icon="👨‍👩‍👧‍👦" label={t['label_children']} value={profile.children} />
                </div>

                {/* Interests */}
                {profile.interests && profile.interests.length > 0 && (
                    <div style={{ marginBottom: '25px' }}>
                        <h3 className="font-heading" style={{ fontSize: '1.1rem', margin: '0 0 15px', textAlign: isRtl ? 'right' : 'left' }}>{t['interests_label']}</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', direction: isRtl ? 'rtl' : 'ltr' }}>
                            {profile.interests.map((i: any, idx: number) => (
                                <span key={idx} style={{
                                    background: 'var(--primary-light)', padding: '6px 12px', borderRadius: '20px',
                                    fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)'
                                }}>
                                    {typeof i === 'string' ? i : i.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Monetization & Business Section */}
                <div style={{ marginBottom: '25px' }}>
                    <h3 className="font-heading" style={{ fontSize: '1.1rem', margin: '0 0 15px', textAlign: isRtl ? 'right' : 'left' }}>{t['business_gains']}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px', direction: isRtl ? 'rtl' : 'ltr' }}>
                        <div
                            onClick={() => router.push('/wallet')}
                            style={{
                                background: 'white', padding: '15px', borderRadius: '16px',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.05)', cursor: 'pointer',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                                transition: 'transform 0.2s'
                            }}>
                            <div style={{ fontSize: '2rem' }}>💰</div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#333' }}>{t['wallet']}</div>
                            <div style={{ fontSize: '0.75rem', color: '#666' }}>{t['manage_earnings']}</div>
                        </div>
                        <div
                            onClick={() => router.push('/places')}
                            style={{
                                background: 'white', padding: '15px', borderRadius: '16px',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.05)', cursor: 'pointer',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                                transition: 'transform 0.2s'
                            }}>
                            <div style={{ fontSize: '2rem' }}>🍽️</div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#333' }}>{t['places']}</div>
                            <div style={{ fontSize: '0.75rem', color: '#666' }}>{t['places_desc']}</div>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push('/business/register')}
                        style={{
                            width: '100%', padding: '15px',
                            background: '#0F172A', color: 'white', border: 'none',
                            borderRadius: '16px', fontWeight: 700, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            boxShadow: '0 4px 15px rgba(15, 23, 42, 0.2)',
                            flexDirection: isRtl ? 'row-reverse' : 'row'
                        }}>
                        {t['become_partner']}
                    </button>
                </div>

                <h3 className="font-heading" style={{ fontSize: '1.1rem', margin: '0 0 15px', textAlign: isRtl ? 'right' : 'left' }}>{t['photos']}</h3>
                <div className="card-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', direction: isRtl ? 'rtl' : 'ltr' }}>
                    {profile.photos?.map((photo: any, index: number) => (
                        <div key={index} style={{ aspectRatio: '1', borderRadius: '10px', overflow: 'hidden', background: '#eee' }}>
                            <img
                                src={getPhotoUrl(photo)}
                                alt={`Photo ${index}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    ))}
                    {(!profile.photos || profile.photos.length < 6) && (
                        <div
                            onClick={() => router.push('/profile/edit')}
                            style={{
                                aspectRatio: '1', borderRadius: '10px', border: '2px dashed #ddd',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#ccc', fontSize: '2rem', cursor: 'pointer'
                            }}
                        >
                            +
                        </div>
                    )}
                </div>

                <button
                    onClick={() => router.push('/profile/edit')}
                    style={{
                        width: '100%', padding: '15px', marginTop: '30px',
                        background: '#f0f4ff', color: '#448aff',
                        border: 'none', borderRadius: '12px', fontWeight: 700,
                        cursor: 'pointer', marginBottom: '10px'
                    }}
                >
                    {t['edit_profile_btn']}
                </button>

                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%', padding: '15px',
                        background: '#fff0f0', color: '#ff4444',
                        border: 'none', borderRadius: '12px', fontWeight: 700,
                        cursor: 'pointer'
                    }}
                >
                    {t['logout']}
                </button>
            </div>

            <BottomNav />
        </main>
    );
}

const ActionButton = ({ icon, label, active, onClick }: any) => (
    <div onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
        <div style={{
            width: '60px', height: '60px', borderRadius: '50%',
            background: active ? 'linear-gradient(135deg, #ff6b6b, #ff4757)' : 'white',
            color: active ? 'white' : '#666',
            boxShadow: active ? '0 10px 20px rgba(255, 71, 87, 0.4)' : '0 5px 15px rgba(0,0,0,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', transition: 'all 0.2s'
        }}>
            {icon}
        </div>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#666' }}>{label}</span>
    </div>
);
