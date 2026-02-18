"use client";
import React, { useState } from 'react';

export default function Payment() {
    const [method, setMethod] = useState('tmoney');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handlePayment = async () => {
        if (!phone) return alert('Veuillez entrer votre numéro');
        setLoading(true);

        // Simuler l'appel API
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
        }, 2000);
    };

    if (success) {
        return (
            <main style={{ background: 'var(--background)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div className="premium-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                    <h2 className="font-heading">Paiement Réussi !</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Votre compte Premium est maintenant activé.</p>
                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }} onClick={() => window.location.href = '/'}>
                        Retour au Feed
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main style={{ background: 'var(--background)', minHeight: '100vh', padding: '2rem 1rem' }}>
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                <h1 className="font-heading" style={{ marginBottom: '1rem' }}>Premium</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Débloquez les likes illimités et boostez votre visibilité au Togo.</p>

                <div className="premium-card" style={{ marginBottom: '2rem', border: '1px solid var(--primary)', background: 'rgba(255,107,53,0.05)' }}>
                    <h2 className="font-heading" style={{ color: 'var(--primary)' }}>2.000 FCFA / mois</h2>
                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}>✅ Likes illimités</li>
                        <li style={{ marginBottom: '0.5rem' }}>✅ Voir qui vous a aimé</li>
                        <li>✅ 5 Boosts par mois</li>
                    </ul>
                </div>

                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Mode de paiement</h3>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <button
                        onClick={() => setMethod('tmoney')}
                        style={{
                            flex: 1, padding: '1rem', borderRadius: '12px', border: method === 'tmoney' ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                            background: method === 'tmoney' ? 'rgba(255,107,53,0.1)' : 'var(--glass)', color: 'white', cursor: 'pointer', transition: '0.3s'
                        }}
                    >
                        TMoney
                    </button>
                    <button
                        onClick={() => setMethod('moov')}
                        style={{
                            flex: 1, padding: '1rem', borderRadius: '12px', border: method === 'moov' ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                            background: method === 'moov' ? 'rgba(255,107,53,0.1)' : 'var(--glass)', color: 'white', cursor: 'pointer', transition: '0.3s'
                        }}
                    >
                        Moov Money
                    </button>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Numéro de téléphone</label>
                    <input
                        type="tel"
                        placeholder="ex: 90 00 00 00"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="input-field"
                        style={{ background: 'var(--surface)', border: '1px solid var(--glass-border)' }}
                    />
                </div>

                <button
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '1.2rem' }}
                    onClick={handlePayment}
                    disabled={loading}
                >
                    {loading ? 'Traitement...' : `Payer avec ${method === 'tmoney' ? 'TMoney' : 'Moov Money'}`}
                </button>

                <button
                    onClick={() => window.history.back()}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', width: '100%', marginTop: '2rem', cursor: 'pointer' }}
                >
                    Annuler
                </button>
            </div>
        </main>
    );
}
