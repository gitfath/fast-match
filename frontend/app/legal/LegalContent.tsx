"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

export const mentionsLegalesContent = `
    <h2>1. Éditeur de l’application</h2>
    <p>Nom de l’application : Fast Match<br/>
    Nature : Application mobile de mise en relation<br/>
    Pays d’exploitation : République Togolaise<br/>
    Contact : support@fastmatch.app</p>
    <p>Fast Match est éditée et exploitée par son propriétaire légal, responsable du traitement des données collectées via l’application.</p>

    <h2>2. Hébergement</h2>
    <p>Les données sont hébergées sur des serveurs sécurisés exploités par des prestataires professionnels conformes aux standards internationaux de sécurité.</p>
    <p>Les données peuvent être stockées hors du territoire togolais, dans le respect des principes internationaux de protection des données.</p>

    <h2>3. Objet du service</h2>
    <p>Fast Match est une plateforme numérique permettant la mise en relation entre personnes majeures souhaitant interagir à des fins sociales ou relationnelles.</p>
    <p>Fast Match n’est pas une agence matrimoniale et ne garantit ni la véracité des informations fournies par les utilisateurs, ni le succès des rencontres.</p>

    <h2>4. Responsabilité</h2>
    <p>Chaque utilisateur est seul responsable :</p>
    <ul>
        <li>Des informations publiées sur son profil</li>
        <li>Des messages envoyés</li>
        <li>Des interactions hors plateforme</li>
    </ul>
    <p>Fast Match ne saurait être tenue responsable des comportements individuels des utilisateurs.</p>

    <h2>5. Propriété intellectuelle</h2>
    <p>Tous les éléments de l’application (logo, design, textes, interface, code) sont protégés par les lois relatives à la propriété intellectuelle.</p>
    <p>Toute reproduction non autorisée est interdite.</p>
`;

export const privacyContent = `
    <h2>1. Données collectées</h2>
    <p>Nous collectons :</p>
    <ul>
        <li>Informations d’identification (prénom, âge, genre)</li>
        <li>Coordonnées (email, numéro de téléphone)</li>
        <li>Photos téléchargées</li>
        <li>Localisation approximative</li>
        <li>Messages échangés</li>
        <li>Données techniques (appareil, IP)</li>
    </ul>

    <h2>2. Finalités du traitement</h2>
    <p>Les données sont utilisées pour :</p>
    <ul>
        <li>Fournir le service de mise en relation</li>
        <li>Assurer la sécurité des utilisateurs</li>
        <li>Prévenir les fraudes</li>
        <li>Améliorer l’application</li>
    </ul>

    <h2>3. Base légale</h2>
    <p>Le traitement des données repose sur :</p>
    <ul>
        <li>Le consentement explicite de l’utilisateur</li>
        <li>L’exécution du contrat d’utilisation</li>
        <li>L’intérêt légitime lié à la sécurité de la plateforme</li>
    </ul>

    <h2>4. Durée de conservation</h2>
    <p>Les données sont conservées tant que le compte est actif.</p>
    <p>En cas de suppression du compte :</p>
    <ul>
        <li>Les données personnelles sont supprimées sous 30 jours</li>
        <li>Les données nécessaires à la sécurité peuvent être conservées temporairement</li>
    </ul>

    <h2>5. Droits des utilisateurs</h2>
    <p>Conformément aux standards internationaux (incluant les principes du RGPD), l’utilisateur dispose du droit :</p>
    <ul>
        <li>D’accès</li>
        <li>De rectification</li>
        <li>De suppression</li>
        <li>D’opposition</li>
        <li>De portabilité</li>
    </ul>
    <p>Toute demande peut être adressée à : support@fastmatch.app</p>

    <h2>6. Sécurité</h2>
    <p>Fast Match met en œuvre des mesures techniques et organisationnelles visant à protéger les données contre tout accès non autorisé, altération ou divulgation.</p>
`;

export const cguContent = `
    <h2>1. Éligibilité</h2>
    <p>L’accès à Fast Match est strictement réservé aux personnes âgées de 18 ans ou plus.</p>
    <p>Toute inscription d’un mineur entraînera la suppression immédiate du compte.</p>

    <h2>2. Obligations des utilisateurs</h2>
    <p>Il est strictement interdit :</p>
    <ul>
        <li>De créer un faux profil</li>
        <li>D’usurper une identité</li>
        <li>De harceler ou menacer</li>
        <li>De publier du contenu sexuellement explicite</li>
        <li>De solliciter de l’argent</li>
        <li>D’utiliser l’application à des fins illégales</li>
    </ul>

    <h2>3. Modération</h2>
    <p>Fast Match se réserve le droit de :</p>
    <ul>
        <li>Suspendre un compte</li>
        <li>Supprimer un compte</li>
        <li>Bannir définitivement un utilisateur</li>
    </ul>
    <p>Toute décision de modération vise à garantir un environnement sécurisé.</p>

    <h2>4. Suppression du compte</h2>
    <p>L’utilisateur peut supprimer son compte à tout moment via :</p>
    <p>Paramètres → Supprimer mon compte</p>
    <p>La suppression entraîne l’effacement des données personnelles sous 30 jours.</p>
`;

export const securityContent = `
    <p>Fast Match encourage les utilisateurs à :</p>
    <ul>
        <li>Ne pas partager d’informations financières</li>
        <li>Ne jamais envoyer d’argent à un inconnu</li>
        <li>Organiser les premières rencontres dans un lieu public</li>
        <li>Signaler immédiatement tout comportement suspect</li>
    </ul>
    <p>Tout signalement est examiné par l’équipe de modération.</p>
`;

export const helpContent = `
    <p>Pour toute question ou assistance :</p>
    <p>Email : support@fastmatch.app<br/>
    Délai de réponse : 24 à 72 heures</p>
    <p>Une FAQ est disponible dans l’application pour répondre aux questions courantes.</p>
`;

const LegalPage = ({ title, content }: { title: string, content: string }) => {
    const router = useRouter();
    return (
        <main style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif', lineHeight: '1.6', background: 'white', minHeight: '100vh' }}>
            <button
                onClick={() => router.back()}
                style={{ marginBottom: '20px', cursor: 'pointer', border: 'none', background: '#f5f5f5', padding: '10px 20px', borderRadius: '12px', fontWeight: 600 }}
            >
                ← Retour
            </button>
            <h1 style={{ marginBottom: '30px', color: '#ff4757' }}>{title}</h1>
            <div style={{ color: '#444' }} dangerouslySetInnerHTML={{ __html: content }} />
        </main>
    );
};

export default LegalPage;
