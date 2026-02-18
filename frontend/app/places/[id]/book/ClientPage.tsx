"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { API_BASE_URL } from '../../../config';

interface Place {
    id: string;
    name: string;
    cashbackRate: number;
}



export default function BookingScreen() {
    const router = useRouter();
    const { id } = useParams();
    const [place, setPlace] = useState<Place | null>(null);
    const [matches, setMatches] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        matchId: '',
        date: '',
        time: '',
        numPeople: '2',
        estimatedAmount: '10000',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const [pRes, mRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/business/place/${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`${API_BASE_URL}/chat/matches`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);
                if (pRes.ok) setPlace(await pRes.json());
                // Matches return may vary, handling based on probable API
                if (mRes.ok) {
                    const data = await mRes.json();
                    setMatches(Array.isArray(data) ? data : []);
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/business/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    businessId: id,
                    matchId: formData.matchId,
                    date: `${formData.date}T${formData.time}`,
                    numPeople: formData.numPeople,
                    estimatedAmount: formData.estimatedAmount,
                    message: formData.message
                })
            });

            if (res.ok) {
                alert('Réservation confirmée !');
                router.push('/chat');
            } else {
                alert('Erreur lors de la réservation');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const cashback = (parseFloat(formData.estimatedAmount) || 0) * ((place?.cashbackRate || 0) / 100);

    return (
        <main style={{ minHeight: '100vh', background: '#F8F9FA', padding: '20px' }}>
            <header style={{ display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
                <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', marginRight: '15px' }}>←</button>
                <h1 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Réserver pour mon RDV</h1>
            </header>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748B', marginBottom: '10px' }}>👥 Avec qui avez-vous rendez-vous ?</label>
                    <select
                        required
                        value={formData.matchId}
                        onChange={e => setFormData({ ...formData, matchId: e.target.value })}
                        style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8F9FA' }}>
                        <option value="">Sélectionner un match</option>
                        {matches.map(m => (
                            <option key={m.id} value={m.id}>{m.partner?.profile?.name || m.user?.profile?.name || 'Inconnu'}</option>
                        ))}
                    </select>
                </div>

                <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748B', marginBottom: '10px' }}>Date</label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748B', marginBottom: '10px' }}>Heure</label>
                            <input
                                type="time"
                                required
                                value={formData.time}
                                onChange={e => setFormData({ ...formData, time: e.target.value })}
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748B', marginBottom: '10px' }}>💰 Estimation consommations (FCFA)</label>
                    <input
                        type="number"
                        value={formData.estimatedAmount}
                        onChange={e => setFormData({ ...formData, estimatedAmount: e.target.value })}
                        style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '1.2rem', fontWeight: 700 }}
                    />
                    <div style={{ marginTop: '15px', padding: '15px', background: '#FFF5F2', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.9rem', color: '#64748B' }}>Cashback estimé ({place?.cashbackRate}%):</span>
                        <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>{cashback.toLocaleString()} F</span>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748B', marginBottom: '10px' }}>Message optionnel (pour le lieu)</label>
                    <textarea
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Ex: Une table au calme si possible..."
                        style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', minHeight: '80px' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '20px', borderRadius: '20px', border: 'none',
                        background: 'black', color: 'white', fontWeight: 800,
                        fontSize: '1.1rem', cursor: 'pointer', marginTop: '10px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                    }}>
                    {loading ? 'Réservation...' : 'CONFIRMER LA RÉSERVATION'}
                </button>
                <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#94A3B8', marginTop: '-10px' }}>
                    La réservation sera notifiée à votre match et au partenaire.
                </div>
            </form>
        </main>
    );
}
