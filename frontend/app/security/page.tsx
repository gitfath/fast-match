"use client";
import React from 'react';
import Link from 'next/link';
import BottomNav from '../../components/BottomNav';

export default function Security() {
    return (
        <main style={{ background: 'var(--background)', minHeight: '100vh', padding: '2rem 1rem 6rem' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, display: 'block', marginBottom: '2rem' }}>← Retour</Link>
                <h1 className="font-heading" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Sécurité & Confiance 🛡️</h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="premium-card">
                        <h3 className="font-heading" style={{ marginBottom: '1rem' }}>Protection des données</h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Vos informations sont cryptées et stockées de manière sécurisée. Nous ne partageons jamais vos contacts personnels sans votre consentement explicite.
                        </p>
                    </div>

                    <div className="premium-card">
                        <h3 className="font-heading" style={{ marginBottom: '1rem' }}>Signalement de comportement</h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Tout comportement inapproprié peut être signalé en un clic. Notre équipe de modération intervient 24/7 pour garantir un environnement sain.
                        </p>
                    </div>

                    <div className="premium-card" style={{ background: 'var(--accent-light)', borderColor: 'var(--primary)' }}>
                        <h3 className="font-heading" style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Conseils de rencontre</h3>
                        <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                            <li>Rencontrez-vous toujours dans un lieu public.</li>
                            <li>Informez un ami de votre rendez-vous.</li>
                            <li>Ne partagez pas de données bancaires.</li>
                        </ul>
                    </div>
                </div>
            </div>
            <BottomNav />
        </main>
    );
}
