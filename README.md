# Fast Match - Site de rencontre Togo 🇹🇬

"Rencontrez, Swipez, Connectez – vite et simplement"

## 🚀 Vision
Une plateforme de rencontre moderne, sécurisée et adaptée à la culture togolaise, permettant aux jeunes locaux et à la diaspora de se connecter.

## 🛠️ Stack Technique
- **Frontend**: Next.js 15 (Mobile-first, Vanilla CSS Premium)
- **Backend**: Node.js + Express (TypeScript, ESM)
- **Base de données**: PostgreSQL + Prisma
- **Temps réel**: Socket.io
- **Cache**: Redis

## 📂 Structure du projet
- `/frontend`: Application Next.js
- `/backend`: API REST et serveur WebSocket

## 📦 Fonctionnalités implémentées (Base)
- [x] Inscription et Connexion (JWT)
- [x] Gestion de profil (Création, Lecture, Mise à jour)
- [x] Algorithme de recommandation (basé sur les intérêts)
- [x] Système de Swipe (Like/Dislike)
- [x] Détection de Match mutuel
- [x] API de messagerie (Récupération des matchs et messages)

## 🚧 En cours / À venir
- [ ] Interface mobile complète (Swipe UI)
- [ ] Chat temps réel via Socket.io (Logique serveur prête)
- [ ] Intégration Paiement Mobile (TMoney / Moov)
- [ ] Upload de photos (Cloudinary / S3)

## ⚙️ Installation
1. Configurer les fichiers `.env` dans `/frontend` et `/backend`.
2. Backend: `npm install`, `npx prisma generate`, `npm run dev`.
3. Frontend: `npm install`, `npm run dev`.
