"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../config';

interface Booking {
    id: string;
    numPeople: number;
    status: string;
    date: string;
    user: {
        profile: {
            name: string;
        }
    }
}

export default function BusinessDashboard() {
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboard = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/business/dashboard`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setData(await res.json());
            else router.push('/business/register');
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_BASE_URL}/business/bookings/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            if (res.ok) fetchDashboard();
        } catch (e) { console.error(e); }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Chargement...</div>;
    if (!data) return null;

    return (
        <main style={{ minHeight: '100vh', background: '#F1F5F9', padding: '20px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Bonjour, {data.business.name}</h1>
                    <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Tableau de bord partenaire</div>
                </div>
                <button onClick={() => router.push('/settings')} style={{ background: 'none', border: 'none', fontSize: '1.2rem' }}>⚙️</button>
            </header>

            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '30px' }}>
                {[
                    { label: 'Réservations', value: data.stats.totalBookings, color: '#0F172A' },
                    { label: 'En attente', value: data.stats.pendingBookings, color: '#FF6B35' },
                    { label: 'Aujourd\'hui', value: data.stats.todayBookings, color: '#10B981' },
                    { label: 'CA estimé', value: '45k', color: '#3B82F6' }
                ].map((stat, i) => (
                    <div key={i} style={{ background: 'white', padding: '20px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700, marginTop: '5px' }}>{stat.label}</div>
                    </div>
                ))}
            </section>

            <section style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>RÉSERVATIONS RÉCENTES</h2>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>VOIR TOUT</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {data.bookings.map((b: Booking) => (
                        <div key={b.id} style={{ background: 'white', padding: '15px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{new Date(b.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {b.user.profile.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{b.numPeople} pers · <span style={{ color: b.status === 'PENDING' ? '#FF6B35' : '#10B981', fontWeight: 600 }}>{b.status}</span></div>
                                </div>
                                {b.status === 'PENDING' && (
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => updateStatus(b.id, 'CONFIRMED')}
                                            style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', background: '#DCFCE7', color: '#10B981', cursor: 'pointer' }}>✅</button>
                                        <button
                                            onClick={() => updateStatus(b.id, 'CANCELLED')}
                                            style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', background: '#FEE2E2', color: '#EF4444', cursor: 'pointer' }}>❌</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {data.bookings.length === 0 && <div style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>Aucune réservation pour le moment.</div>}
                </div>
            </section>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button style={{ padding: '18px', borderRadius: '16px', border: 'none', background: '#0F172A', color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>
                    ➕ AJOUTER UNE OFFRE
                </button>
                <button style={{ padding: '18px', borderRadius: '16px', border: 'none', background: 'white', color: '#0F172A', fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    ⚙️ PARAMÈTRES
                </button>
            </div>
        </main>
    );
}
