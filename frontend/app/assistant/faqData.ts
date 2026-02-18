export type FAQItem = {
    question: string;
    answer: string;
};

export type FAQCategory = {
    id: string;
    title: string;
    icon: string;
    items: FAQItem[];
};

export type FAQTranslations = {
    [key: string]: FAQCategory[]
};

// Helper to clone and translate titles easily
// Content is kept in French for bulk items to ensure availability
const frData = [
    {
        id: 'general',
        title: 'Questions générales',
        icon: '🌍',
        items: [
            { question: "C'est quoi cette application ?", answer: "Notre application est une plateforme de rencontre conçue pour t'aider à rencontrer de nouvelles personnes au Togo. Tu peux découvrir des profils, chatter et faire des rencontres selon tes préférences." },
            { question: "C'est gratuit ou payant ?", answer: "L'application est gratuite pour les fonctionnalités de base (swipe, match, chat). Nous proposons également des options payantes (Super Likes, boosts, abonnement Premium) pour ceux qui veulent plus de fonctionnalités." },
            { question: "Elle est disponible au Togo seulement ?", answer: "Pour l'instant, l'application est optimisée pour le Togo avec des moyens de paiement locaux (MTN Money, Moov Money) et une modération adaptée. Tu peux l'utiliser ailleurs, mais les paiements sont en F CFA." },
            { question: "C'est pour quel type de relation ?", answer: "L'application est ouverte à tous : relation sérieuse, amitié, relation occasionnelle. Tu peux indiquer tes préférences dans ton profil." },
            { question: "Elle est comme Tinder ?", answer: "Le principe est similaire (swipe pour liker, chat après match), mais notre application est adaptée au contexte togolais avec des moyens de paiement locaux et une modération tenant compte de la culture locale." }
        ]
    },
    {
        id: 'account',
        title: 'Inscription & compte',
        icon: '📝',
        items: [
            { question: "Comment je crée un compte ?", answer: "Télécharge l'application, clique sur \"Créer un compte\", choisis ton mode d'inscription (email, téléphone, Google, Apple) et suis les étapes. C'est simple et rapide !" },
            { question: "Je dois donner mon vrai numéro ?", answer: "Oui, un numéro valide est nécessaire pour la vérification et sécuriser ton compte. Il ne sera pas visible par les autres utilisateurs." },
            { question: "Je n'ai pas 18 ans, je peux quand même ?", answer: "Non, c'est strictement interdit par la loi togolaise. L'âge minimum est 18 ans révolus. Tout compte mineur sera supprimé et signalé aux autorités." },
            { question: "Je ne reçois pas le code de vérification par SMS", answer: "Vérifie que ton numéro est au format +228 XX XX XX XX et que tu as du réseau. Si le problème persiste après 3 tentatives, contacte notre support avec ton numéro." },
            { question: "J'ai oublié mon mot de passe", answer: "Sur l'écran de connexion, clique sur \"Mot de passe oublié\". Tu recevras un lien de réinitialisation par email ou SMS. Suis les instructions pour créer un nouveau mot de passe." },
            { question: "Je peux avoir plusieurs comptes ?", answer: "Non, un seul compte par personne. Les comptes multiples sont détectés et supprimés sans préavis." },
            { question: "Mon compte a été bloqué, pourquoi ?", answer: "Tu as reçu une notification par email avec le motif. Les raisons possibles : non-respect des règles, signalements, activité suspecte, âge non conforme. Vérifie tes emails ou contacte le support." },
            { question: "Comment contester un blocage ?", answer: "Va dans \"Centre de sécurité\" → \"Contester une sanction\" ou réponds à l'email que tu as reçu. Notre équipe réétudiera ton dossier sous 48h." }
        ]
    },
    {
        id: 'daily',
        title: 'Utilisation quotidienne',
        icon: '📅',
        items: [
            { question: "Comment fonctionne le swipe ?", answer: "Swipe à droite (ou cœur) si la personne t'intéresse, swipe à gauche (ou croix) si elle ne t'intéresse pas. Si vous vous likez mutuellement, c'est un match !" },
            { question: "Combien de likes gratuits par jour ?", answer: "Tu as 50 likes gratuits par jour. Passé ce quota, tu dois attendre le lendemain ou passer en Premium pour des likes illimités. La réinitialisation a lieu à minuit." },
            { question: "Je vois toujours les mêmes profils", answer: "Essaie d'élargir tes filtres (âge, distance). L'algorithme peut te montrer à nouveau des profils si tu n'as pas interagi avec. Tu peux aussi mettre à jour tes préférences." },
            { question: "C'est quoi un Super Like ?", answer: "C'est un like \"fort\" qui montre à la personne qu'elle t'intéresse particulièrement. Elle verra une étoile bleue sur ta carte. Tu as 1 Super Like gratuit par jour." },
            { question: "Comment modifier mon profil ?", answer: "Va dans \"Mon Profil\" → \"Éditer\". Tu peux changer tes photos, ta bio, tes infos et tes préférences. Les modifications sont immédiates." },
            { question: "Comment savoir si j'ai un match ?", answer: "Tu reçois une notification et une animation \"C'est un match !\" s'affiche. Tu peux ensuite envoyer un message depuis la liste des conversations." },
            { question: "Je peux envoyer des photos dans le chat ?", answer: "Oui, clique sur le + à côté de la zone de texte. Attention : les photos sont modérées (pas de nudité, pas de contenu offensant)." },
            { question: "Comment bloquer quelqu'un ?", answer: "Dans la conversation ou sur son profil, clique sur les trois points → \"Bloquer\". La personne ne pourra plus te contacter et tu ne la verras plus." }
        ]
    },
    {
        id: 'tech',
        title: 'Technique & performance',
        icon: '🛠️',
        items: [
            { question: "Sur quels téléphones ça marche ?", answer: "L'application fonctionne sur iOS (iPhone 6s et +, iOS 13 minimum) et Android (Android 8.0 et +). Elle est optimisée pour les smartphones récents." },
            { question: "Elle consomme beaucoup de données ?", answer: "En utilisation normale : environ 50 MB pour 100 profils, 10 MB pour 100 messages texte, 20 MB par minute d'appel vidéo. Active le mode \"Économie de données\" dans Paramètres pour réduire." },
            { question: "Il faut le Wi-Fi ou la 4G ?", answer: "Une connexion 3G, 4G ou Wi-Fi est nécessaire. En 2G, l'application sera très lente. En zone blanche, elle ne fonctionnera pas." },
            { question: "L'appli plante souvent", answer: "Vérifie que tu as la dernière version. Si le problème persiste, vide le cache de l'application, redémarre ton téléphone, ou contacte le support avec ton modèle de téléphone et la version du système." },
            { question: "Les photos ne chargent pas", answer: "Vérifie ta connexion. Si le problème persiste, ferme et rouvre l'application. Sur réseau lent, les photos peuvent mettre du temps à charger." },
            { question: "Pourquoi je dois mettre à jour ?", answer: "Les mises à jour apportent des corrections de bugs, des améliorations de sécurité et de nouvelles fonctionnalités. Pour une expérience optimale, nous recommandons de toujours utiliser la dernière version." },
            { question: "Si je désinstalle, je perds mes données ?", answer: "Non, ton compte reste actif. Si tu réinstalles, tu retrouveras ton profil et tes conversations. Pour supprimer définitivement, il faut le faire depuis Paramètres." }
        ]
    },
    {
        id: 'security',
        title: 'Sécurité & confidentialité',
        icon: '🛡️',
        items: [
            { question: "Comment être sûr que la personne est réelle ?", answer: "Vérifie si elle a le badge \"Vérifié\" (selfie validé). Propose un appel vidéo avant de rencontrer. Méfie-toi des profils trop parfaits. Fais une recherche inversée d'image Google si tu doutes." },
            { question: "Que faire si quelqu'un me demande de l'argent ?", answer: "1) Ne donne JAMAIS d'argent. 2) Fais une capture d'écran. 3) Signale immédiatement la personne (bouton ••• → Signaler). 4) Bloque-la. C'est une arnaque, nous bannissons ces comptes." },
            { question: "Conseils pour une première rencontre ?", answer: "Préviens un proche (lieu, heure, nom). Choisis un lieu public (café, restaurant, centre commercial). Viens par tes propres moyens. Garde ton téléphone chargé. Fixe une heure de fin." },
            { question: "La personne veut qu'on passe sur WhatsApp tout de suite", answer: "Méfiance. Garder la conversation sur l'application permet de nous signaler en cas de problème. Si la personne insiste, c'est souvent un signe d'arnaque." },
            { question: "Numéros d'urgence au Togo ?", answer: "Police : 117, Gendarmerie : 172, Allo Enfance (mineurs) : 8226. En cas de danger immédiat, appelle ces numéros." },
            { question: "Qui peut voir mon profil ?", answer: "Tous les utilisateurs de l'application, sauf si tu as bloqué certaines personnes ou activé le mode incognito (option payante)." },
            { question: "Ma position exacte est-elle visible ?", answer: "Non, seule une distance approximative est affichée (ex: \"à 5 km\"). Ta position exacte n'est jamais partagée. Tu peux aussi masquer la distance dans Paramètres." },
            { question: "Mes photos peuvent être téléchargées par d'autres ?", answer: "Techniquement, quelqu'un peut faire une capture d'écran. Nous ne pouvons pas l'empêcher. Sois vigilant sur ce que tu partages et signale tout abus." }
        ]
    },
    {
        id: 'money',
        title: 'Gains & monétisation',
        icon: '💰',
        items: [
            { question: "Comment acheter des Super Likes ?", answer: "Va dans la Boutique (icône 🛒). Choisis le lot qui t'intéresse (5, 20, 50 Super Likes). Sélectionne ton moyen de paiement (MTN Money, Moov Money, carte) et confirme. Les Super Likes sont crédités immédiatement." },
            { question: "Quels moyens de paiement acceptez-vous ?", answer: "Mobile Money (MTN Money, Moov Money, Togocom), cartes bancaires (Visa, Mastercard), et paiement via stores (Apple Pay, Google Pay). Tous les prix sont en F CFA." },
            { question: "Comment payer avec MTN Money ?", answer: "1) Choisis ton produit. 2) Sélectionne \"MTN Money\". 3) Saisis ton numéro MTN. 4) Tu reçois une notification USSD sur ton téléphone. 5) Confirme avec ton code secret. 6) Les Super Likes sont crédités immédiatement." },
            { question: "Le paiement Mobile Money est-il sécurisé ?", answer: "Oui, tu ne saisis jamais ton code secret dans l'application. La confirmation se fait directement sur ton téléphone via le système sécurisé de l'opérateur." },
            { question: "J'ai payé mais je n'ai pas reçu mes Super Likes", answer: "1) Vérifie ton solde dans la Boutique. 2) Attends 5 minutes (parfois le réseau est lent). 3) Si toujours rien, contacte le support avec ta référence de transaction (le numéro reçu par SMS)." },
            { question: "Quels sont les avantages Premium ?", answer: "Likes illimités, Super Likes gratuits chaque mois, voir qui t'a liké, mode incognito, boost mensuel, badge \"Premium\" sur ton profil." },
            { question: "Combien coûte l'abonnement ?", answer: "1 mois : 5 000 F CFA, 3 mois : 12 000 F CFA (4 000/mois), 1 an : 35 000 F CFA (environ 2 900/mois). Meilleur rapport qualité-prix : 1 an." },
            { question: "Comment résilier mon abonnement ?", answer: "Va dans Paramètres → Mon abonnement → \"Résilier\". Tu peux aussi le faire depuis les stores (Apple/Google) si tu as payé via eux. La résiliation prend effet à la fin de la période en cours." },
            { question: "C'est quoi un boost ?", answer: "Pendant la durée du boost (30min, 1h, 2h), ton profil est mis en avant et vu par plus de personnes. Active-le depuis la Boutique ou l'écran Boost." }
        ]
    },
    {
        id: 'juridique',
        title: 'Juridique & conformité',
        icon: '⚖️',
        items: [
            { question: "Pourquoi 18 ans ?", answer: "C'est l'âge légal requis par la loi togolaise (Code des personnes et de la famille). Nous devons nous y conformer. Toute personne mineure est interdite sur l'application." },
            { question: "Que faites-vous si un mineur est détecté ?", answer: "Bannissement immédiat et définitif, signalement aux autorités (Allo Enfance, police), conservation des preuves. C'est une obligation légale." },
            { question: "Quelles données collectez-vous sur moi ?", answer: "Données d'inscription (email, téléphone, date naissance), profil (photos, bio, préférences), utilisation (likes, messages), transactions (pas de données bancaires), logs techniques." },
            { question: "Mes données sont-elles vendues à des tiers ?", answer: "Non. Jamais. Nous ne vendons pas tes données personnelles. Elles sont utilisées uniquement pour le fonctionnement de l'application et son amélioration." },
            { question: "Puis-je récupérer toutes mes données ?", answer: "Oui, c'est ton droit. Va dans \"Centre de confidentialité\" → \"Exporter mes données\". Tu recevras un lien de téléchargement sous 72h." },
            { question: "Comment supprimer définitivement mes données ?", answer: "Supprime ton compte dans Paramètres. Tes données sont effacées sous 30 jours (sauf obligation légale de conservation pour les transactions)." },
            { question: "Où est basée votre entreprise ?", answer: "Notre entreprise est une société de droit togolais, immatriculée à Lomé. Toutes nos activités sont conformes à la législation togolaise." },
            { question: "En cas de litige, quel tribunal est compétent ?", answer: "Conformément à nos CGU, les tribunaux de Lomé (Togo) sont seuls compétents." }
        ]
    },
    {
        id: 'moderation',
        title: 'Modération & signalement',
        icon: '👮',
        items: [
            { question: "Comment signaler un utilisateur ?", answer: "Depuis son profil, clique sur les trois points ••• → \"Signaler\". Choisis le motif et ajoute si possible une capture d'écran. Ton signalement est anonyme." },
            { question: "Que se passe-t-il après un signalement ?", answer: "1) Tu reçois une confirmation immédiate. 2) Notre équipe examine sous 48h. 3) Si fondé, des sanctions sont prises (avertissement, suspension, bannissement). 4) Tu n'es pas informé de la sanction (confidentialité)." },
            { question: "Différence entre bloquer et signaler ?", answer: "Bloquer : tu ne vois plus la personne (action personnelle). Signaler : tu alertes la modération pour une possible sanction (action collective). Les deux sont complémentaires." },
            { question: "La personne bloquée sait-elle que je l'ai bloquée ?", answer: "Non, elle ne reçoit aucune notification. Elle verra juste que la conversation a disparu ou que ton profil n'est plus visible." },
            { question: "Je peux débloquer quelqu'un ?", answer: "Oui, dans Paramètres → Blocages → trouve la personne → \"Débloquer\". La conversation reprendra normalement si elle existe encore." },
            { question: "Quelles sont les sanctions possibles ?", answer: "Avertissement (simple notification), suspension temporaire (7 à 30 jours), bannissement définitif. Pour les cas graves (mineurs, menaces), signalement aux autorités." },
            { question: "Je peux contester une sanction ?", answer: "Oui, dans \"Centre de sécurité\" → \"Contester une sanction\" ou en répondant à l'email reçu. Notre équipe réétudiera ton dossier." }
        ]
    },
    {
        id: 'data',
        title: 'Données personnelles',
        icon: '🔐',
        items: [
            { question: "Vous vendez mes données ?", answer: "Non. Nous ne vendons aucune donnée personnelle. C'est contraire à nos valeurs et à la loi togolaise sur la protection des données." },
            { question: "Vous partagez avec Facebook ou Google ?", answer: "Non, sauf si tu te connectes via ces services (et uniquement pour l'authentification). Nous ne partageons pas tes données avec eux." },
            { question: "Vous gardez mes données combien de temps ?", answer: "Compte actif : jusqu'à résiliation. Transactions : 5 ans (obligation comptable). Logs de connexion : 1 an. Signalements : 3 ans. Après suppression, tout est effacé sous 30 jours." },
            { question: "C'est quoi la HAPLUCIA ?", answer: "C'est l'autorité togolaise de protection des données. En cas de litige non résolu avec nous, tu peux la saisir. Ses coordonnées sont dans notre Politique de confidentialité." },
            { question: "Je peux voir les données que vous avez sur moi ?", answer: "Oui, c'est ton droit d'accès. Va dans \"Centre de confidentialité\" → \"Exporter mes données\". Tu recevras un fichier avec toutes tes données." },
            { question: "Mes messages sont-ils privés ?", answer: "Oui, ils sont chiffrés et privés. Cependant, si un utilisateur te signale, nous pouvons avoir accès aux messages pour modération (avec consentement ou réquisition)." }
        ]
    },
    {
        id: 'problems',
        title: 'Problèmes courants',
        icon: '🆘',
        items: [
            { question: "Je n'arrive pas à me connecter", answer: "Vérifie ton email/mot de passe. Si oublié, utilise \"Mot de passe oublié\". Si le problème persiste, vérifie ta connexion internet ou contacte le support." },
            { question: "L'appli rame", answer: "Vérifie ta connexion. Ferme les applications en arrière-plan. Redémarre l'appli. Si toujours lent, vide le cache ou réinstalle." },
            { question: "Je ne reçois pas les notifications", answer: "Vérifie dans Paramètres → Notifications que l'application est autorisée. Sur Android, désactive le mode \"Économie d'énergie\" pour l'appli." },
            { question: "J'ai payé mais je n'ai rien reçu", answer: "1) Attends 5 minutes. 2) Vérifie ton solde. 3) Contacte le support avec ta référence de transaction. Nous résolvons sous 24-48h." },
            { question: "On m'a volé mon compte", answer: "Contacte immédiatement le support. Fournis ton email et si possible une preuve d'identité. Nous bloquerons le compte et t'aiderons à le récupérer." },
            { question: "Je veux supprimer mon compte", answer: "Va dans Paramètres → \"Supprimer mon compte\". Confirme. C'est irréversible. Tes données seront effacées sous 30 jours." }
        ]
    },
    {
        id: 'humour',
        title: 'Questions "idiotes" et improbables',
        icon: '🤪',
        items: [
            { question: "Je peux matcher avec une célébrité ?", answer: "Si la célébrité est sur l'application et que vous êtes dans la même zone, techniquement oui ! Mais nous ne pouvons pas garantir que Ronaldo ou Beyoncé utiliseront l'appli." },
            { question: "L'appli peut prédire mon âme sœur ?", answer: "Notre algorithme te propose des profils compatibles, mais trouver l'âme sœur, c'est un peu de magie et beaucoup de chance ! On te souhaite de la trouver." },
            { question: "Je peux payer en nature (poulets, œufs, manioc) ?", answer: "C'est une question originale ! Malheureusement, nous n'acceptons que les paiements via Mobile Money ou carte bancaire. Mais on apprécie ta créativité !" },
            { question: "Je peux utiliser l'appli sous l'eau ?", answer: "À moins que ton téléphone soit étanche ET que tu aies un réseau sous-marin, ça risque d'être compliqué. On te conseille d'ouvrir les yeux." },
            { question: "\"Swipe\", c'est un truc de blanc ?", answer: "(Rire) Non, le swipe est juste un geste universel sur les applications modernes ! Tu peux swiper où que tu sois, blanc, noir, ou autre." },
            { question: "C'est un péché d'utiliser votre appli ?", answer: "Chaque religion a ses propres préceptes. Nous respectons toutes les croyances. L'application est un outil de rencontre, son usage dépend de tes convictions personnelles." },
            { question: "Je peux trouver quelqu'un pour m'aider au champ ?", answer: "Si tu cherches un partenaire de vie qui aime aussi travailler la terre, pourquoi pas ! Précise-le dans ta bio, tu trouveras peut-être quelqu'un de motivé." },
            { question: "La personne que j'aime ne m'aime pas, c'est un bug ?", answer: "(Sourire) Ce n'est pas un bug, c'est la vie. Notre algorithme peut t'aider à rencontrer des gens, mais il ne contrôle pas les sentiments. Courage !" },
            { question: "Je peux matcher avec mon ex pour le reconquérir ?", answer: "Si ton ex est sur l'application et que vous vous likez mutuellement, oui. Mais on ne garantit pas que ça règle les problèmes de la rupture." },
            { question: "Vous avez un marabout qui travaille pour l'appli ?", answer: "Non, nous n'avons pas de marabout. Notre équipe est composée de développeurs, de modérateurs et de support client. Pour les questions de cœur, on te laisse faire le reste !" },
            { question: "Je peux utiliser l'appli avec les yeux fermés ?", answer: "Techniquement, oui, mais tu risques de swiper à gauche sur la personne de ta vie ! On te conseille d'ouvrir les yeux." },
            { question: "Si je mets la photo de quelqu'un d'autre, vous allez le savoir ?", answer: "Oui, notre système peut détecter les photos volées. Et si la vraie personne porte plainte, tu seras banni. Sois toi-même !" },
            { question: "Je peux épouser l'application ?", answer: "(Rire) On est flatté, mais on préfère rester des entremetteurs. Notre rôle est de t'aider à trouver un vrai partenaire, pas de nous substituer à lui." },
            { question: "L'appli reconnaît mon chien ?", answer: "La reconnaissance faciale est pour les humains. Pour ton chien, on te conseille une application pour animaux. Mais tu peux le mettre en photo, on ne dira rien !" },
            { question: "Je peux swiper avec mon pied ?", answer: "Si tu arrives à utiliser ton téléphone avec ton pied, techniquement oui. Mais c'est plus simple avec le pouce, non ?" }
        ]
    }
];

export const faqData: FAQTranslations = {
    'Français': frData,
    'English': frData.map(cat => ({
        ...cat,
        title: {
            'general': 'General Questions',
            'account': 'Registration & Account',
            'daily': 'Daily Usage',
            'tech': 'Technical & Performance',
            'security': 'Security & Privacy',
            'money': 'Earnings & Monetization',
            'juridique': 'Legal & Compliance',
            'moderation': 'Moderation & Reporting',
            'data': 'Personal Data',
            'problems': 'Common Problems',
            'humour': 'Fun & Improbable Questions'
        }[cat.id] || cat.title
    })),
    'العربية': frData.map(cat => ({
        ...cat,
        title: {
            'general': 'أسئلة عامة',
            'account': 'التسجيل والحساب',
            'daily': 'الاستخدام اليومي',
            'tech': 'التقنية والأداء',
            'security': 'الأمان والخصوصية',
            'money': 'الأرباح وتحقيق الدخل',
            'juridique': 'القانون والامتثال',
            'moderation': 'الإشراف والإبلاغ',
            'data': 'البيانات الشخصية',
            'problems': 'مشاكل شائعة',
            'humour': 'أسئلة طريفة وغير محتملة'
        }[cat.id] || cat.title
    }))
};
