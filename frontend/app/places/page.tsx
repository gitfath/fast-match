"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../config';
import { translations } from '../../utils/translations';

interface Place {
    id: string;
    name: string;
    type: string;
    address: string;
    city?: string;
    neighborhood?: string;
    mapsUrl?: string;
    cashbackRate: number;
    photos: string;
}

export default function PlacesSearchScreen() {
    const router = useRouter();
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'list' | 'map'>('list');
    const [language, setLanguage] = useState('Français');

    useEffect(() => {
        const savedLang = localStorage.getItem('app_language');
        if (savedLang) setLanguage(savedLang);

        const fetchPlaces = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`${API_BASE_URL}/business/search`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setPlaces(await res.json());
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchPlaces();
    }, []);

    const t = translations[language] || translations['Français'];
    const isRtl = language === 'العربية';

    const openMap = (url: string | undefined) => {
        if (url) window.open(url, '_blank');
        else alert(t['location_unavailable']);
    };

    return (
        <main style={{ minHeight: '100vh', background: 'white', direction: isRtl ? 'rtl' : 'ltr' }}>
            <header style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
                <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', transform: isRtl ? 'scaleX(-1)' : 'none' }}>←</button>
                <div style={{ flex: 1, position: 'relative' }}>
                    <input
                        placeholder={t['search_place_placeholder']}
                        style={{ width: '100%', padding: '12px 15px', paddingLeft: isRtl ? '15px' : '40px', paddingRight: isRtl ? '40px' : '15px', borderRadius: '12px', border: 'none', background: '#F1F5F9' }}
                    />
                    <span style={{ position: 'absolute', left: isRtl ? 'auto' : '15px', right: isRtl ? '15px' : 'auto', top: '12px' }}>🔍</span>
                </div>
            </header>

            <div style={{ padding: '0 20px 20px' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
                    <button
                        onClick={() => setView('list')}
                        style={{
                            flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
                            background: view === 'list' ? 'var(--primary)' : '#F1F5F9',
                            color: view === 'list' ? 'white' : '#64748B', fontWeight: 700, cursor: 'pointer'
                        }}>
                        {t['view_list']}
                    </button>
                    {/* Map view placeholder */}
                    <button
                        onClick={() => setView('map')}
                        style={{
                            flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
                            background: view === 'map' ? 'var(--primary)' : '#F1F5F9',
                            color: view === 'map' ? 'white' : '#64748B', fontWeight: 700, cursor: 'pointer'
                        }}>
                        {t['view_map']}
                    </button>
                </div>

                <section>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>{t['partners_title']}</h2>
                    <div style={{ display: 'grid', gap: '20px' }}>
                        {places.map(place => (
                            <div
                                key={place.id}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                    background: 'white',
                                    borderRadius: '16px',
                                    padding: '15px',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                                    border: '1px solid #f0f0f0'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '5px' }}>{place.name}</div>
                                        <div style={{ fontSize: '0.9rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <span>🏢 {place.type}</span>
                                            {place.neighborhood && (
                                                <>
                                                    <span>•</span>
                                                    <span>📍 {place.neighborhood}, {place.city}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {place.cashbackRate > 0 && (
                                        <div style={{
                                            background: '#ECFDF5', color: '#10B981', fontWeight: 800,
                                            padding: '5px 10px', borderRadius: '8px', fontSize: '0.85rem'
                                        }}>
                                            -{place.cashbackRate}%
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                                    <button
                                        onClick={() => router.push(`/places/${place.id}`)}
                                        style={{
                                            flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
                                            background: '#F1F5F9', color: '#334155', fontWeight: 600, cursor: 'pointer'
                                        }}
                                    >
                                        {t['details_btn']}
                                    </button>
                                    {place.mapsUrl && (
                                        <button
                                            onClick={() => openMap(place.mapsUrl)}
                                            style={{
                                                flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
                                                background: '#EFF6FF', color: '#3B82F6', fontWeight: 600, cursor: 'pointer'
                                            }}
                                        >
                                            🗺️ {t['view_on_maps']}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && <div style={{ textAlign: 'center', padding: '20px' }}>{t['loading']}</div>}
                        {!loading && places.length === 0 && <div style={{ textAlign: 'center', color: '#64748B', padding: '20px' }}>{t['no_partners_found']}</div>}
                    </div>
                </section>
            </div>
        </main>
    );
}
