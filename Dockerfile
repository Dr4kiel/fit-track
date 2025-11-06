# Utilise l'image officielle Node.js comme image de base
FROM node:18-alpine

# Installer les dépendances système nécessaires
RUN apk add --no-cache libc6-compat openssl

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json* ./

# Copier le schéma Prisma
COPY prisma ./prisma/

# Installer les dépendances
RUN npm ci --only=production && npm cache clean --force

# Générer le client Prisma
RUN npx prisma generate

# Copier le reste du code de l'application
COPY . .

# Créer le répertoire pour la base de données
RUN mkdir -p /app/prisma

# Construire l'application Next.js
RUN npm run build

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Changer les permissions
RUN chown -R nextjs:nodejs /app
USER nextjs

# Exposer le port utilisé par Next.js
EXPOSE 3000

# Initialiser la base de données et démarrer l'application
CMD ["sh", "-c", "npx prisma migrate deploy 2>/dev/null || true && npm start"]