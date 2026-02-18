
# Arrêter le processus node si nécessaire (manuel)
Write-Host "Assurez-vous que le serveur backend est arrêté avant de continuer." -ForegroundColor Yellow

# Générer le client Prisma
Write-Host "Génération du client Prisma..." -ForegroundColor Cyan
npx prisma generate

# Pousser le schéma vers la base de données
Write-Host "Mise à jour de la base de données..." -ForegroundColor Cyan
npx prisma db push

Write-Host "Configuration terminée ! Vous pouvez maintenant lancer 'npm run dev' dans le dossier backend." -ForegroundColor Green
