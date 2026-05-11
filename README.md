# Ecopass

Ecopass est une plateforme Next.js pour la declaration et la gestion du coût environnemental des produits textiles.

Le projet fonctionne avec 2 processus applicatifs distincts :

- le serveur web Next.js
- la queue

## Vue d'ensemble

Flux principal :

1. Un utilisateur charge un fichier (CSV ou XLSX) sur la plateforme.
2. Le worker lit la queue des uploads, parse le fichier, puis cree les produits.
3. Le worker traite les produits en attente : validation des produits, puis calculs Ecobalyse et mise a jour des statuts.
4. Le worker traite aussi les exports et genere des zips des étiquettes.

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

Les tests unitaires couvrent les fonctions metier, les services, les parsers et une partie des acces à la base.

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

Les scenarios e2e sont dans le dossier e2e et verifient les parcours utilisateurs complets (auth, API, administration, etc.).

Commande :

```sh
npx playwright test --ui
```

Prerequis avant de lancer les e2e :

1. Demarrer le serveur web : `pnpm dev`
2. Demarrer la queue : `pnpm queue:watch`
3. Verifier que PostgreSQL et Maildev tournent : `docker compose up -d`

## S3

Sur les differents environnements deployes (si la variable d'environnement LOCAL_STORAGE n'est pas égale à true), les fichiers uploadés ainsi que les zips contenant les étiquettes sont stockés sur le S3 Scaleway.
https://console.scaleway.com/object-storage/buckets

En local (LOCAL_STORAGE=true), les fichiers sont stockés dans le dossier `s3`.

## Deploiement

Il y a 3 environnements, tous sur Scalingo avec une base PostgreSQL :

- l'environnement de preprod, deployee automatiquement avec la branche develop (une fois que la CI est passée). Il est utilisé principalement pour des demos.
  https://dashboard.scalingo.com/apps/osc-fr1/ecobalyse-ecopass-preprod
  https://ecobalyse-ecopass-preprod.osc-fr1.scalingo.io/

- l'environnement de test, deploye automatiquement avec la branche main (une fois que la CI est passée). Il est utilisé principalement pour des demos. Il est utilisé par les clients pour leurs tests d'integration ou pour simuler des declarations.
  https://dashboard.scalingo.com/apps/osc-fr1/ecobalyse-ecopass-test
  https://ecobalyse-ecopass-test.osc-fr1.scalingo.io/

- l'environnement de prod, deploye automatiquement avec la branche main (une fois que la CI est passée).
  https://dashboard.scalingo.com/apps/osc-secnum-fr1/ecobalyse-ecopass-secnum
  https://affichage-environnemental.ecobalyse.beta.gouv.fr/

Note : pour les deux premiers environnements, il n'y a pas de serveur mail (pour eviter les spams) et le ProConnect utilise est celui de test (comme en local). Il est conseillé d'utiliser des adresses yopmail pour tester.
