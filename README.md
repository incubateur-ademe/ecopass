# Ecopass

Projet **Ecopass** — Plateforme Next.js (en version beta) pour la déclaration et la gestion du coût environnemental des produits textiles.

## Prérequis

- Node.js (>= 22)
- Docker (pour PostgreSQL et Maildev)
- PNPM

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

   Pour correctement faire fonctionner le projet en local vous aurez besoin de specifier les secrets ProConnect (`PROCONNECT_CLIENT_ID`, `PROCONNECT_CLIENT_SECRET` et `NEXT_PUBLIC_PROCONNECT_DOMAIN`, à recuperer depuis l'env preprod scalingo ou demander à un dev), la clé d'encryption Ecobalyse (`ECOBALYSE_ENCRYPTION_KEY`) et une clé INSEE (`INSEE_API_KEY`, disponible sur https://api.insee.fr/catalogue/site/themes/wso2/subthemes/insee/pages/item-info.jag?name=Sirene&version=V3.11&provider=insee). Vous pourrez enfin generer `ENCRYPTION_KEY`et `STORAGE_ENCRYPTION_KEY`avec la commande `openssl rand -hex 32`

3. **Lancer les services Docker**

   ```sh
   docker compose up -d
   ```

   Cela démarre :
   - PostgreSQL (bases de données, une pour le dev, port 5432 et une pour les tests unitaires, port 5433)
   - Maildev (serveur mail pour tests)

4. **Installer les dépendances**

   ```sh
   pnpm install
   ```

5. **Initialiser Prisma**

   Le projet utilise Prisma comme ORM. Les scripts suivants initialisent le schema de la base et ajoute des fixtures.

   ```sh
   npx prisma generate
   npx prisma migrate deploy
   npx prisma db seed
   ```

6. **Lancer le site**

   Pour lancer le site web vous pouvez utilisez :

   ```sh
   pnpm dev
   ```

7. **Générer les données ecobalyse**

   Pour calculer le coût environnemental des produits, on utilise une version en local d'Ecobalyse avec le `server-app.js` ce dernier à besoin des `processes_impacts.json` pour fonctionner. Ils sont décryptés à partir de `processes_impacts.json.enc` et de la variable d'environnement `ECOBALYSE_ENCRYPTION_KEY` :

   ```sh
   pnpm ecobalyse:data
   ```

8. **Lancer la queue**

   Pour processer les téléchargements de zip et les produits déposés sur la plateforme vous devez lancer la queue :

   ```sh
   pnpm queue:watch
   ```

9. **Tests unitaires**

   Les tests unitaires sont lancés avec Jest. La plupart des tests utilises des fonctions de mocks pour limiter leur scope. Les fonctions de db sont testés directement avec une vraie base.

   ```sh
   npx jest
   ```

10. **Tests e2e**

Les tests e2e sont lancés avec playwright, attention de bien lancé au préalable le serveur web et la queue.

```sh
npx playwright test
```

11. **S3**

En production et preprod, les fichiers CSV envoyés sont encryptés puis stocké sur un S3 scaleway (variables d'environnement `S3_ACCESS_KEY` et `S3_SECRET_KEY`). En local il est recommandé de stocker les fichiers en local (variable d'environnement `LOCAL_STORAGE=true`, par defaut dans le `.env.dist`)

## Accès

- Application : [http://localhost:3000](http://localhost:3000)
- Maildev : [http://localhost:1080](http://localhost:1080)

## Statut

_Beta_ — Merci de remonter tout bug ou suggestion via les issues du dépôt.

---

**Note :**  
Ce projet utilise Next.js (App Router), Prisma, PostgreSQL, Maildev et des variables d'environnement pour la configuration.
