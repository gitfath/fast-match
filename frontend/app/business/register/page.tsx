"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../config';

export default function BusinessRegister() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        type: 'Restaurant',
        address: '',
        phone: '',
        email: '',
        openingHours: '',
        cashbackRate: '10',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/business/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setSuccess(true);
            } else {
                alert('Erreur lors de l\'inscription');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
                <div style={{ maxWidth: '400px', background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚀</div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '15px' }}>Demande envoyée !</h1>
                    <p style={{ color: '#64748B', lineHeight: 1.6 }}>Merci d'avoir rejoint le programme partenaire. Notre équipe va examiner votre demande et vous contactera sous 48h.</p>
                    <button
                        onClick={() => router.push('/')}
                        style={{ marginTop: '25px', padding: '15px 30px', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
                        Retour à l'accueil
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main style={{ minHeight: '100vh', background: '#F8F9FA', padding: '40px 20px' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <button
                    onClick={() => router.back()}
                    style={{
                        position: 'absolute', top: '20px', left: '20px',
                        background: 'white', border: 'none', borderRadius: '50%',
                        width: '40px', height: '40px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer', fontSize: '1.2rem'
                    }}
                >
                    ✕
                </button>
                <header style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '10px' }}>FAST MATCH BUSINESS</div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 10px' }}>Devenir partenaire</h1>
                    <p style={{ color: '#64748B' }}>📍 Attirez de nouveaux clients grâce aux rencontres !</p>
                </header>

                <form onSubmit={handleSubmit} style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 25px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'grid', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px' }}>Nom du commerce *</label>
                            <input
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px' }}>Type d'établissement *</label>
                            <select
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                                <option>Restaurant</option>
                                <option>Bar</option>
                                <option>Cinéma</option>
                                <option>Hôtel</option>
                                <option>Autre</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px' }}>Adresse *</label>
                            <input
                                required
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Lomé, Boulevard du 13 Janvier"
                                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px' }}>Téléphone *</label>
                                <input
                                    required
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px' }}>Email *</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px' }}>Offrez du cashback ? (Taux %)</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {['5', '10', '15'].map(rate => (
                                    <button
                                        key={rate}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, cashbackRate: rate })}
                                        style={{
                                            flex: 1, padding: '10px', borderRadius: '10px', border: formData.cashbackRate === rate ? '2px solid var(--primary)' : '1px solid #E2E8F0',
                                            background: formData.cashbackRate === rate ? '#FFF5F2' : 'white', fontWeight: 700
                                        }}>
                                        {rate}%
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px' }}>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', minHeight: '100px' }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%', padding: '18px', borderRadius: '16px', border: 'none',
                                background: 'black', color: 'white', fontWeight: 800,
                                fontSize: '1.1rem', cursor: 'pointer', marginTop: '10px'
                            }}>
                            {loading ? 'Envoi...' : 'ENVOYER MA DEMANDE'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
