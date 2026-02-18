"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import BottomNav from '../../components/BottomNav';
import TopHeader from '../../components/TopHeader';
import ProfileCard from '../../components/ProfileCard';
import { API_BASE_URL, BACKEND_URL } from '../config';
import { translations } from '../../utils/translations';

export default function Discover() {
    const [profiles, setProfiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProfile, setSelectedProfile] = useState<any>(null);
    const [language, setLanguage] = useState('Français');

    useEffect(() => {
        const savedLang = localStorage.getItem('app_language');
        if (savedLang) setLanguage(savedLang);
        fetchProfiles();
    }, []);

    const t = translations[language] || translations['Français'];
    const isRtl = language === 'العربية';

    const fetchProfiles = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_BASE_URL}/matches/recommendations`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setProfiles(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getPhotoUrl = (photo: any) => {
        if (!photo) return 'https://via.placeholder.com/300x400';
        let url = typeof photo === 'string' ? photo : photo.url;
        if (!url) return 'https://via.placeholder.com/300x400';

        // Fix stale absolute URLs (e.g. from localhost on a mobile device)
        if (url.includes('/uploads/')) {
            const fileName = url.split('/uploads/')[1];
            return `${BACKEND_URL}/uploads/${fileName}`;
        }

        if (url.startsWith('http')) return url;
        if (url.startsWith('uploads')) return `${BACKEND_URL}/${url.startsWith('/') ? '' : '/'}${url}`;
        if (url.startsWith('/')) return `${BACKEND_URL}${url}`;

        return `${BACKEND_URL}/${url}`;
    };

    return (
        <main style={{
            background: '#f8f9fa',
            minHeight: '100vh',
            paddingBottom: '100px',
            paddingTop: '60px',
            direction: isRtl ? 'rtl' : 'ltr'
        }}>
            <TopHeader />

            <div style={{ padding: '20px 20px 10px' }}>
                <h1 className="font-heading" style={{ fontSize: '2rem', margin: 0 }}>{t['discover_title']}</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t['people_nearby']}</p>
            </div>

            {/* Places Banner */}
            <div style={{ padding: '0 20px 20px' }}>
                <Link href="/places" style={{ textDecoration: 'none' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #FF6B6B 0%, #FF4757 100%)',
                        borderRadius: '20px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        color: 'white', boxShadow: '0 10px 25px rgba(255, 71, 87, 0.3)',
                        flexDirection: isRtl ? 'row-reverse' : 'row'
                    }}>
                        <div>
                            <h3 style={{ margin: '0 0 5px', fontSize: '1.2rem', fontWeight: 800 }}>{t['where_to_go_tonight']}</h3>
                            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>{t['discover_places_cashback']}</p>
                        </div>
                        <div style={{ fontSize: '2rem', transform: isRtl ? 'rotate(180deg)' : 'none' }}>➜</div>
                    </div>
                </Link>
            </div>

            {/* Profile Detail Modal */}
            {selectedProfile && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 150 }}>
                    <ProfileCard
                        profile={selectedProfile}
                        mode="full"
                        onClose={() => setSelectedProfile(null)}
                        onLike={() => alert(t['like_from_grid'])}
                        onPass={() => setSelectedProfile(null)}
                    />
                </div>
            )}

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '10px' }}>
                {loading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} style={{ aspectRatio: '3/4', background: '#eee', borderRadius: '16px' }} className="animate-pulse"></div>
                    ))
                ) : profiles.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                        <p>{t['no_profiles_nearby']}</p>
                    </div>
                ) : (
                    profiles.map(profile => (
                        <div
                            key={profile.id}
                            onClick={() => setSelectedProfile(profile)}
                            style={{
                                position: 'relative',
                                aspectRatio: '3/4',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                cursor: 'pointer'
                            }}
                        >
                            <img
                                src={getPhotoUrl(profile.photos?.[0])}
                                alt={profile.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                padding: '40px 10px 10px',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                color: 'white'
                            }}>
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{profile.name}, {profile.age}</h3>
                                {profile.isOnline && (
                                    <div style={{
                                        position: 'absolute', top: 10, right: 10,
                                        width: '12px', height: '12px', background: '#00E676',
                                        borderRadius: '50%', border: '2px solid white'
                                    }}></div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <BottomNav />
        </main>
    );
}
