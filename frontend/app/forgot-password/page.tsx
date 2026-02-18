"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../config';

export default function ForgotPassword() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError("Veuillez entrer une adresse email valide.");
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Un code à 6 chiffres a été envoyé à votre email.');
                setStep(2);
            } else {
                setError(data.message || 'Erreur lors de l\'envoi du code');
            }
        } catch (err) {
            setError('Impossible de contacter le serveur. Vérifiez votre connexion.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();

        if (code.length !== 6) {
            setError("Le code doit contenir 6 chiffres.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_BASE_URL}/auth/verify-reset-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Code vérifié ! Vous pouvez maintenant définir un nouveau mot de passe.');
                setStep(3);
            } else {
                setError(data.message || 'Code invalide ou expiré');
            }
        } catch (err) {
            setError('Erreur de connexion au serveur');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 8) {
            setError("Le mot de passe doit contenir au moins 8 caractères.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code, newPassword }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Mot de passe réinitialisé avec succès ! Redirection...');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setError(data.message || 'Erreur lors de la réinitialisation');
            }
        } catch (err) {
            setError('Erreur de connexion au serveur');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--background)',
            padding: '1rem'
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
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔐</div>
                    <h1 className="font-heading" style={{ fontSize: '2rem', color: 'var(--text-main)', margin: 0 }}>
                        {step === 1 && 'Mot de passe oublié'}
                        {step === 2 && 'Vérification'}
                        {step === 3 && 'Nouveau mot de passe'}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                        {step === 1 && 'Entrez votre email pour recevoir un code'}
                        {step === 2 && 'Entrez le code à 6 chiffres'}
                        {step === 3 && 'Définissez votre nouveau mot de passe'}
                    </p>
                </div>

                {error && (
                    <div style={{
                        color: '#e74c3c',
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        padding: '0.8rem',
                        background: '#fdecea',
                        borderRadius: '12px',
                        fontWeight: 600,
                        marginBottom: '1.5rem'
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                {success && (
                    <div style={{
                        color: '#27ae60',
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        padding: '0.8rem',
                        background: '#eafaf1',
                        borderRadius: '12px',
                        fontWeight: 600,
                        marginBottom: '1.5rem'
                    }}>
                        ✅ {success}
                    </div>
                )}

                {/* Step 1: Email */}
                {step === 1 && (
                    <form onSubmit={handleSendCode}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                marginBottom: '0.5rem',
                                color: 'var(--text-main)',
                                paddingLeft: '4px'
                            }}>
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                placeholder="exemple@email.com"
                                required
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                            style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? 'Envoi...' : 'Envoyer le code'}
                        </button>
                    </form>
                )}

                {/* Step 2: Code Verification */}
                {step === 2 && (
                    <form onSubmit={handleVerifyCode}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                marginBottom: '0.5rem',
                                color: 'var(--text-main)',
                                paddingLeft: '4px'
                            }}>
                                Code à 6 chiffres
                            </label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                    setCode(value);
                                }}
                                className="input-field"
                                placeholder="000000"
                                required
                                autoFocus
                                maxLength={6}
                                style={{
                                    fontSize: '1.5rem',
                                    letterSpacing: '0.5rem',
                                    textAlign: 'center',
                                    fontWeight: 700
                                }}
                            />
                            <p style={{
                                fontSize: '0.8rem',
                                color: 'var(--text-muted)',
                                marginTop: '0.5rem',
                                textAlign: 'center'
                            }}>
                                Code envoyé à {email}
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                            style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? 'Vérification...' : 'Vérifier le code'}
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
                            ← Retour
                        </button>
                    </form>
                )}

                {/* Step 3: New Password */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword}>
                        <div style={{ marginBottom: '1.2rem' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                marginBottom: '0.5rem',
                                color: 'var(--text-main)',
                                paddingLeft: '4px'
                            }}>
                                Nouveau mot de passe
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="input-field"
                                placeholder="••••••••"
                                required
                                autoFocus
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                marginBottom: '0.5rem',
                                color: 'var(--text-main)',
                                paddingLeft: '4px'
                            }}>
                                Confirmer le mot de passe
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input-field"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                            style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                        </button>
                    </form>
                )}

                <div style={{
                    marginTop: '2rem',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    borderTop: '1px solid rgba(0,0,0,0.05)',
                    paddingTop: '1.5rem'
                }}>
                    <Link href="/login" style={{
                        color: 'var(--primary)',
                        fontWeight: 700,
                        textDecoration: 'none'
                    }}>
                        ← Retour à la connexion
                    </Link>
                </div>
            </div>
        </main>
    );
}
