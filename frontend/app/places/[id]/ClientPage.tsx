"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { API_BASE_URL } from '../../config';

interface Place {
    id: string;
    name: string;
    type: string;
    address: string;
    phone: string;
    openingHours: string;
    cashbackRate: number;
    description: string;
    photos: string;
}



export default function PlaceDetailScreen() {
    const router = useRouter();
    const { id } = useParams();
    const [place, setPlace] = useState<Place | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlace = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`${API_BASE_URL}/business/place/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setPlace(await res.json());
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchPlace();
    }, [id]);

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Chargement...</div>;
    if (!place) return <div style={{ padding: '40px', textAlign: 'center' }}>Lieu non trouvé</div>;

    return (
        <main style={{ minHeight: '100vh', background: 'white' }}>
            <div style={{ position: 'relative', height: '35vh', background: '#F1F5F9' }}>
                <button
                    onClick={() => router.back()}
                    style={{ position: 'absolute', top: '20px', left: '20px', width: '40px', height: '40px', borderRadius: '50%', background: 'white', border: 'none', fontSize: '1.2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', cursor: 'pointer', zIndex: 10 }}>
                    ←
                </button>
                <div style={{ position: 'absolute', top: '20px', right: '20px', width: '40px', height: '40px', borderRadius: '50%', background: 'white', border: 'none', fontSize: '1.2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
                    ❤️
                </div>
            </div>

            <div style={{ padding: '25px', marginTop: '-30px', background: 'white', borderTopLeftRadius: '30px', borderTopRightRadius: '30px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0 }}>{place.name}</h1>
                        <div style={{ color: 'var(--primary)', fontWeight: 700, marginTop: '5px' }}>⭐ 4.5 (120 avis) · {place.type}</div>
                    </div>
                    <div style={{ background: '#FFF5F2', padding: '10px 15px', borderRadius: '15px', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary)' }}>{place.cashbackRate}%</div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--primary)', fontWeight: 700 }}>CASHBACK</div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', margin: '25px 0', borderTop: '1px solid #F1F5F9', paddingTop: '25px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span>📍</span>
                        <span style={{ fontSize: '0.9rem', color: '#64748B' }}>{place.address}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span>🕒</span>
                        <span style={{ fontSize: '0.9rem', color: '#64748B' }}>{place.openingHours || '9h - 23h · Ouvert maintenant'}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span>📞</span>
                        <span style={{ fontSize: '0.9rem', color: '#64748B' }}>{place.phone}</span>
                    </div>
                </div>

                <div style={{ background: 'var(--gradient-primary)', padding: '20px', borderRadius: '20px', color: 'white', marginBottom: '30px' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '5px' }}>💰 {place.cashbackRate}% DE CASHBACK</div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Pour tout premier rendez-vous réservé via l'application.</div>
                </div>

                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '10px' }}>À propos</h2>
                    <p style={{ color: '#64748B', lineHeight: 1.6, fontSize: '0.95rem' }}>
                        {place.description || 'Cadre agréable idéal pour un premier rendez-vous. Service de qualité et ambiance chaleureuse.'}
                    </p>
                </section>

                <div style={{ position: 'sticky', bottom: '20px', background: 'white', padding: '10px 0' }}>
                    <button
                        onClick={() => router.push(`/places/${id}/book`)}
                        style={{
                            width: '100%', padding: '20px', borderRadius: '20px', border: 'none',
                            background: 'black', color: 'white', fontWeight: 800,
                            fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                        }}>
                        RÉSERVER POUR MON RENDEZ-VOUS
                    </button>
                </div>
            </div>
        </main>
    );
}
