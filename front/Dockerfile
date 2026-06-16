# --- Étape 1 : Build de l'application React ---
FROM node:26-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Étape 2 : Serveur web pour les fichiers statiques ---
FROM nginx:alpine AS prod
# On copie le build dans le dossier que Nginx sert par défaut
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]