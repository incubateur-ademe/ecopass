# Ecopass

Ecopass est une plateforme Next.js pour la declaration et la gestion du coût environnemental des produits textiles.

Le projet fonctionne avec 2 processus applicatifs distincts :

- le serveur web Next.js
- la queue

## Vue d'ensemble

Flux principal :

1. Un utilisateur charge un fichier (CSV ou XLSX) sur la plateforme.
2. Le worker lit la queue des uploads, parse le fichier, puis cree les produits.
3. Le worker traite les produits en attente : validations produits puis calculs Ecobalyse et update de status.
4. Le worker traite aussi les exports et genere des zip des étiquettes.

Composants techniques :

- Front/API : Next.js (App Router)
- Base de donnees : PostgreSQL
- ORM : Prisma
- Worker : script TypeScript boucle infinie (queue.ts)
- Email local : Maildev
- Stockage fichiers : local en dev (LOCAL_STORAGE=true), S3 en preprod/prod

## Prerequis

- Node.js 22+
- pnpm 10+
- Docker + Docker Compose

## Installation locale

1. Cloner le depot

```sh
git clone git@github.com:incubateur-ademe/ecopass.git
cd ecopass
```

2. Creer le fichier d'environnement

```sh
cp .env.dist .env
```

Variables importantes a renseigner :

- PROCONNECT_CLIENT_ID
- PROCONNECT_CLIENT_SECRET
- NEXT_PUBLIC_PROCONNECT_DOMAIN
- INSEE_API_KEY
- ECOBALYSE_ENCRYPTION_KEY (necessaire pour decrypter les donnees Ecobalyse)
- ENCRYPTION_KEY et STORAGE_ENCRYPTION_KEY (exemple de generation : openssl rand -hex 32)

3. Demarrer les services techniques

```sh
docker compose up -d
```

Services lances :

- PostgreSQL dev sur le port 5432
- PostgreSQL test sur le port 5433
- Maildev sur les ports 1080 (UI) et 1025 (SMTP)

4. Installer les dependances

```sh
pnpm install
```

5. Initialiser la base

```sh
pnpm prisma:generate
pnpm prisma migrate deploy
pnpm prisma db seed
```

6. Generer les donnees Ecobalyse locales

```sh
pnpm ecobalyse:data
```

## Lancement du projet

Terminal 1 - Next.js :

```sh
pnpm dev
```

Terminal 2 - Queue worker (optionnel si pas d'upload de fichier) :

```sh
pnpm queue:watch
```

## Tests

Le projet contient 2 types de tests :

- tests unitaires/integration avec Jest
- tests e2e avec Playwright

### Tests unitaires (Jest)

Les tests unitaires couvrent les fonctions metier, services, parsers et une partie des acces base.

Commande :

```sh
npx jest --runInBand
```

Prerequis recommandes :

- docker compose up -d (pour avoir la base de test disponible)
- base de test sur le port 5433

Si besoin de reinitialiser la base de test :

```sh
pnpm reset:test
```

### Tests e2e (Playwright)

Les scenarios e2e sont dans le dossier e2e et verifient les parcours utilisateur complets (auth, API, administration, etc.).

Commande :

```sh
npx playwright test --ui
```

Prerequis avant de lancer les e2e :

1. Demarrer le serveur web : `pnpm dev`
2. Demarrer la queue : `pnpm queue:watch`
3. Verifier que PostgreSQL et Maildev tournent : `docker compose up -d`
