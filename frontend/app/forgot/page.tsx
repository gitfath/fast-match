"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function ForgotPassword() {
    const [step, setStep] = useState(1); // 1: Identifier, 2: Code, 3: New Password
    const [identifier, setIdentifier] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendCode = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(2);
        }, 1500);
    };

    const handleVerifyCode = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(3);
        }, 1500);
    };

    const handleResetPassword = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert("Mot de passe réinitialisé avec succès !");
            window.location.href = '/login';
        }, 1500);
    };

    return (
        <main className="hero-section" style={{ minHeight: '100vh', justifyContent: 'center', background: 'var(--background)' }}>
            <div className="premium-card" style={{ width: '100%', maxWidth: '420px', padding: '3.5rem 2.5rem', borderRadius: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔑</div>
                    <h1 className="font-heading" style={{ fontSize: '2.2rem', color: 'var(--text-main)' }}>
                        {step === 1 ? "Oubli ?" : step === 2 ? "Vérification" : "Nouveau départ"}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                        {step === 1 ? "Pas de panique, on vous aide." : step === 2 ? "Entrez le code reçu par SMS/Email." : "Choisissez un mot de passe robuste."}
                    </p>
                </div>

                {step === 1 && (
                    <form onSubmit={handleSendCode} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', paddingLeft: '4px' }}>Email ou Téléphone</label>
                            <input
                                type="text"
                                required
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                className="input-field"
                                placeholder="ex: +228 90 00 00 00"
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', padding: '1.1rem' }}>
                            {loading ? 'Envoi...' : 'Envoyer le code →'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyCode} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', paddingLeft: '4px' }}>Code de sécurité</label>
                            <input
                                type="text"
                                required
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="input-field"
                                placeholder="000 000"
                                style={{ textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.2rem' }}
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', padding: '1.1rem' }}>
                            {loading ? 'Vérification...' : 'Vérifier le code'}
                        </button>
                        <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}>
                            Modifier les coordonnées
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', paddingLeft: '4px' }}>Nouveau mot de passe</label>
                            <input
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="input-field"
                                placeholder="••••••••"
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', padding: '1.1rem' }}>
                            {loading ? 'Réinitialisation...' : 'Changer mon mot de passe'}
                        </button>
                    </form>
                )}

                <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.9rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                    <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 800, textDecoration: 'none' }}>← Retour à la connexion</Link>
                </div>
            </div>
        </main>
    );
}
