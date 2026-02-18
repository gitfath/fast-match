// Constantes pour les champs de profil et préférences
// Copié du backend pour assurer la cohérence

export const PROFILE_OPTIONS = {
    // 1️⃣ IDENTITÉ DE BASE
    GENDER: [
        'Homme',
        'Femme',
        'Non-binaire',
        'Transgenre homme',
        'Transgenre femme',
        'Autre',
        'Préfère ne pas dire'
    ],

    ORIENTATION: [
        'Hétérosexuel(le)',
        'Homosexuel(le)',
        'Bisexuel(le)',
        'Pansexuel(le)',
        'Asexuel(le)',
        'Questionnement',
        'Autre',
        'Préfère ne pas dire'
    ],

    LANGUAGES: [
        'Français',
        'Éwé',
        'Kabyè',
        'Mina',
        'Kotokoli',
        'Anglais',
        'Autre'
    ],

    // 2️⃣ LOCALISATION
    COUNTRY: [
        'Togo',
        'Autre pays africain',
        'Europe',
        'Amérique',
        'Autre'
    ],

    CITY: [
        'Lomé', 'Kara', 'Sokodé', 'Atakpamé', 'Kpalimé', 'Dapaong', 'Tsévié',
        'Aného', 'Sansanné-Mango', 'Bassar', 'Niamtougou', 'Bafilo', 'Notse',
        'Sotouboua', 'Vogan', 'Tabligbo', 'Kandé', 'Pagouda', 'Togoville', 'Autre'
    ],

    DISTANCE: [
        { value: 1, label: '1 km' },
        { value: 5, label: '5 km' },
        { value: 10, label: '10 km' },
        { value: 25, label: '25 km' },
        { value: 50, label: '50 km' },
        { value: 100, label: '100 km' },
        { value: 999999, label: 'Sans limite' }
    ],

    MOBILITY: [
        'Fixe',
        'Mobile occasionnel',
        'Très mobile',
        'Voyage souvent'
    ],

    // 3️⃣ OBJECTIF DE RENCONTRE
    RELATIONSHIP_GOAL: [
        'Sérieuse',
        'Mariage',
        'Amicale',
        'Occasionnelle',
        'Flirt',
        'Discussion seulement',
        'Je ne sais pas encore'
    ],

    OPEN_TO_DISTANCE: [
        'Oui',
        'Non',
        'Peut-être'
    ],

    // 4️⃣ PERSONNALITÉ
    PERSONALITY_TYPE: [
        'Introverti(e)',
        'Extraverti(e)',
        'Ambiverti(e)'
    ],

    TEMPERAMENT: [
        'Calme',
        'Énergique',
        'Passionné(e)',
        'Réservé(e)',
        'Sociable',
        'Leader',
        'Créatif(ve)'
    ],

    HUMOR_IMPORTANCE: [
        'Très important',
        'Important',
        'Peu important',
        'Pas important'
    ],

    // 5️⃣ CENTRES D'INTÉRÊT
    INTERESTS: [
        'Musique',
        'Sport',
        'Danse',
        'Voyage',
        'Lecture',
        'Cinéma',
        'Cuisine',
        'Entrepreneuriat',
        'Technologie',
        'Art',
        'Nature',
        'Jeux vidéo',
        'Réseaux sociaux',
        'Mode',
        'Spiritualité'
    ],

    // 6️⃣ SITUATION PERSONNELLE
    RELATIONSHIP_STATUS: [
        'Célibataire',
        'En couple',
        'Séparé(e)',
        'Divorcé(e)',
        'Veuf / Veuve'
    ],

    CHILDREN: [
        'Aucun',
        '1',
        '2',
        '3+',
        'Préfère ne pas dire'
    ],

    WANTS_CHILDREN: [
        'Oui',
        'Non',
        'Peut-être',
        'Plus tard'
    ],

    // 7️⃣ ÉTUDES & TRAVAIL
    EDUCATION_LEVEL: [
        'Aucun',
        'Primaire',
        'Collège',
        'Lycée',
        'Universitaire',
        'Master',
        'Doctorat'
    ],

    JOB_STATUS: [
        'Étudiant(e)',
        'Salarié(e)',
        'Entrepreneur(e)',
        'Fonctionnaire',
        'Sans emploi',
        'Freelance',
        'Autre'
    ],

    // 8️⃣ RELIGION & VALEURS
    RELIGION: [
        'Chrétien(ne)',
        'Musulman(e)',
        'Traditionnelle',
        'Autre',
        'Aucune',
        'Préfère ne pas dire'
    ],

    RELIGIOUS_PRACTICE: [
        'Pas pratiquant(e)',
        'Peu pratiquant(e)',
        'Pratiquant(e)',
        'Très pratiquant(e)'
    ],

    VALUES: [
        'Famille',
        'Respect',
        'Fidélité',
        'Ambition',
        'Spiritualité',
        'Liberté',
        'Tradition'
    ],

    // 9️⃣ APPARENCE PHYSIQUE
    HEIGHT: [
        '< 1m60',
        '1m60 – 1m70',
        '1m70 – 1m80',
        '1m80'
    ],

    BODY_TYPE: [
        'Mince',
        'Moyenne',
        'Athlétique',
        'Ronde',
        'Forte'
    ],

    STYLE: [
        'Classique',
        'Moderne',
        'Sport',
        'Traditionnel',
        'Chic',
        'Décontracté'
    ],

    // 🔟 HABITUDES
    SMOKING: [
        'Non',
        'Occasionnel',
        'Régulier'
    ],

    DRINKING: [
        'Jamais',
        'Occasionnel',
        'Régulier'
    ],

    SPORTS_FREQUENCY: [
        'Jamais',
        'Parfois',
        'Régulièrement'
    ],

    GOING_OUT: [
        'Rarement',
        'Parfois',
        'Souvent'
    ],

    // 🔐 CONFIDENTIALITÉ
    PROFILE_VISIBILITY: [
        'Public',
        'Privé',
        'Visible aux matchs seulement'
    ],

    MESSAGE_SETTINGS: [
        'Tout le monde',
        'Matchs seulement',
        'Personne'
    ],

    // 🛡️ SÉCURITÉ & STATUT
    ACCOUNT_STATUS: [
        'Actif',
        'Suspendu',
        'Banni',
        'En révision'
    ],

    // 📊 DONNÉES ALGORITHMIQUES
    ACTIVITY_LEVEL: [
        'Nouveau',
        'Actif',
        'Très actif',
        'Inactif'
    ]
};
