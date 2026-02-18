"use client";
import Link from "next/link";

export default function Terms() {
    return (
        <main style={{
            minHeight: '100vh',
            background: 'var(--background)',
            padding: '2rem',
            color: 'white'
        }}>
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                background: 'rgba(255,255,255,0.95)',
                borderRadius: '32px',
                padding: '3rem',
                color: 'var(--text-main)'
            }}>
                <Link href="/" style={{
                    color: 'var(--primary)',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    fontWeight: 700,
                    marginBottom: '2rem',
                    display: 'inline-block'
                }}>
                    ← Retour à l'accueil
                </Link>

                <h1 className="font-heading" style={{
                    fontSize: '2.5rem',
                    marginBottom: '2rem',
                    color: 'var(--text-main)'
                }}>
                    Conditions d'utilisation
                </h1>

                <div style={{ lineHeight: 1.8, fontSize: '1rem' }}>
                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                            1. Acceptation des conditions
                        </h2>
                        <p style={{ color: 'var(--text-muted)' }}>
                            En utilisant Fast Match, vous acceptez ces conditions d'utilisation.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                            2. Éligibilité
                        </h2>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Vous devez avoir au moins 18 ans pour utiliser Fast Match.
                            En créant un compte, vous confirmez que vous avez l'âge légal.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                            3. Comportement des utilisateurs
                        </h2>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Vous vous engagez à utiliser Fast Match de manière respectueuse.
                            Tout comportement abusif, harcèlement ou contenu inapproprié entraînera
                            la suspension ou la suppression de votre compte.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                            4. Contenu utilisateur
                        </h2>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Vous êtes responsable du contenu que vous publiez. Fast Match se réserve
                            le droit de supprimer tout contenu qui viole nos règles ou les lois applicables.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                            5. Résiliation
                        </h2>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Nous nous réservons le droit de suspendre ou de résilier votre compte
                            à tout moment si vous violez ces conditions.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                            6. Contact
                        </h2>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Pour toute question concernant ces conditions, contactez-nous à :
                            <strong> support@fastmatch.tg</strong>
                        </p>
                    </section>

                    <p style={{
                        marginTop: '3rem',
                        fontSize: '0.9rem',
                        color: 'var(--text-muted)',
                        fontStyle: 'italic'
                    }}>
                        Dernière mise à jour : Février 2026
                    </p>
                </div>
            </div>
        </main>
    );
}
