"use client";
import Link from "next/link";

export default function Privacy() {
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
                    Politique de confidentialité
                </h1>

                <div style={{ lineHeight: 1.8, fontSize: '1rem' }}>
                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                            1. Collecte des données
                        </h2>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Nous collectons les informations que vous nous fournissez lors de votre inscription :
                            nom, âge, photos, localisation, et préférences de rencontre. Ces données sont
                            nécessaires pour vous proposer des matchs pertinents.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                            2. Utilisation des données
                        </h2>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Vos données sont utilisées pour :
                        </p>
                        <ul style={{ color: 'var(--text-muted)', marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li>Créer et gérer votre profil</li>
                            <li>Vous proposer des matchs compatibles</li>
                            <li>Améliorer lss services</li>
                            <li>Assurer la sécurité de la plateforme</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                            3. Protection des données
                        </h2>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Nous utilisons des mesures de sécurité avancées pour protéger vos données :
                        </p>
                        <ul style={{ color: 'var(--text-muted)', marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li>Cryptage SSL/TLS pour toutes les communications</li>
                            <li>Stockage sécurisé des mots de passe (hashage bcrypt)</li>
                            <li>Serveurs sécurisés avec pare-feu</li>
                            <li>Accès limité aux données personnelles</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                            4. Partage des données
                        </h2>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Nous ne vendons jamais vos données personnelles. Vos informations de profil
                            sont visibles uniquement par les autres utilisateurs de Fast Match dans le
                            cadre du service de rencontre. Votre numéro de téléphone et email restent
                            privés jusqu'à ce que vous décidiez de les partager avec un match.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                            5. Vos droits
                        </h2>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Vous avez le droit de :
                        </p>
                        <ul style={{ color: 'var(--text-muted)', marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li>Accéder à vos données personnelles</li>
                            <li>Modifier ou supprimer vos informations</li>
                            <li>Supprimer votre compte à tout moment</li>
                            <li>Exporter vos données</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                            6. Cookies
                        </h2>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Nous utilisons des cookies pour améliorer votre expérience et maintenir
                            votre session. Vous pouvez désactiver les cookies dans les paramètres
                            de votre navigateur, mais cela peut affecter certaines fonctionnalités.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                            7. Modifications
                        </h2>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Nous nous réservons le droit de modifier cette politique de confidentialité.
                            Les modifications seront publiées sur cette page avec une date de mise à jour.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                            8. Contact
                        </h2>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Pour toute question concernant vos données personnelles, contactez-nous à :
                            <strong> privacy@fastmatch.tg</strong>
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
