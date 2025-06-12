# Ecopass

Projet **Ecopass** — Plateforme Next.js (en version beta) pour la déclaration et la gestion du coût environnemental des produits textiles.

## Prérequis

- Node.js (>= 22)
- Docker (pour PostgreSQL et Maildev)
- Yarn

## Installation

1. **Cloner le dépôt**

   ```sh
   git clone git@github.com:incubateur-ademe/ecopass.git
   cd ecopass
   ```

2. **Configurer les variables d'environnement**

   Copiez le fichier `.env.dist` en `.env` et adaptez les valeurs `secret` si besoin :

   ```sh
   cp .env.dist .env
   ```

3. **Lancer les services Docker**

   ```sh
   docker compose up -d
   ```

   Cela démarre :

   - PostgreSQL (base de données)
   - Maildev (serveur mail pour tests)

4. **Installer les dépendances**

   ```sh
   yarn install
   ```

5. **Initialiser Prisma**

   Le projet utilise Prisma comme ORM. Les scripts suivants initialisent le schema de la base et ajoute des fixtures.

   ```sh
   npx prisma generate
   npx prisma migrate deploy
   npx prisma db seed
   ```

6. **Démarrer l'application**

   Vous pouvez vous logger avec les utilisateurs `user-X-Y@test.fr` (X et Y entre 0 et 4)

   ```sh
   yarn dev
   ```

7. **Lancer la queue**

   Pour processer les téléchargements de zip et les produits déposés sur la plateforme vous devez lancer la queue :

   ```sh
   yarn queue:watch
   ```

## Accès

- Application : [http://localhost:3000](http://localhost:3000)
- Maildev : [http://localhost:1080](http://localhost:1080)

## Statut

_Beta_ — Merci de remonter tout bug ou suggestion via les issues du dépôt.

---

**Note :**  
Ce projet utilise Next.js (App Router), Prisma, PostgreSQL, Maildev et des variables d'environnement pour la configuration.
