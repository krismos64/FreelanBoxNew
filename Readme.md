# Guide d'installation FreelanceBox Backend

## 1. Prérequis

### Installation de Node.js

```bash
# Installer Homebrew si ce n'est pas déjà fait
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Installer Node.js via Homebrew
brew install node
```

### Installation de MongoDB

```bash
# Installer MongoDB via Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Démarrer MongoDB
brew services start mongodb-community
```

### Extensions VSCode recommandées

- MongoDB for VS Code
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Thunder Client (pour tester les API)
- GitLens
- Error Lens

## 2. Configuration du projet

### Création de la structure

```bash
# Créer le dossier du projet
mkdir freelancebox-backend
cd freelancebox-backend

# Initialiser le projet Node.js
npm init -y

# Installer les dépendances principales
npm install express @prisma/client bcryptjs cors dotenv express-rate-limit helmet jsonwebtoken multer nodemailer pdfkit winston zod

# Installer les dépendances de développement

```

### Configuration TypeScript

```bash
# Initialiser TypeScript
npx tsc --init
```

### Structure des dossiers

```bash
mkdir -p src/{controllers,middleware,routes,utils} prisma uploads
```

## 3. Configuration des variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
DATABASE_URL="mongodb://localhost:27017/freelancebox"
JWT_SECRET="votre-super-secret-key"
JWT_REFRESH_SECRET="votre-refresh-secret-key"
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="votre-email@example.com"
SMTP_PASS="votre-password"
```

## 4. Configuration de Prisma

```bash
# Initialiser Prisma
npx prisma init

# Après avoir configuré le schema.prisma
npx prisma generate
npx prisma db push
```

## 5. Scripts package.json

Mettre à jour le fichier `package.json` :

```json
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate deploy"
  }
}
```

## 6. Lancement du serveur

```bash
# En développement
npm run dev

# En production
npm run build
npm start
```

## 7. Tests et vérification

1. Vérifier que MongoDB est bien lancé :

```bash
mongosh
```

2. Tester l'API avec Thunder Client ou Postman :

- POST http://localhost:5000/api/auth/register
- POST http://localhost:5000/api/auth/login

## 8. Debugging

1. Dans VSCode, créer un fichier `.vscode/launch.json` :

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/src/server.ts",
      "runtimeArgs": ["-r", "ts-node/register"],
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    }
  ]
}
```

## Points d'attention spécifiques MacOS

1. Permissions MongoDB :

```bash
# Si problème de permissions
sudo chown -R $(whoami) /usr/local/var/mongodb
sudo chown $(whoami) /usr/local/etc/mongod.conf
```

2. Ports utilisés :

- Vérifier qu'aucun autre service n'utilise le port 5000

```bash
lsof -i :5000
```

3. Certificats SSL en développement :

- Pour les appels HTTPS en local, ajouter `NODE_TLS_REJECT_UNAUTHORIZED=0` en développement uniquement

## Validation de l'installation

1. Vérifier les versions :

```bash
node --version
npm --version
mongosh --version
```

2. Tester la connexion MongoDB :

```bash
mongosh "mongodb://localhost:27017/freelancebox"
```

3. Vérifier les logs du serveur :

```bash
tail -f combined.log
tail -f error.log
```

En cas de problème :

- Vérifier les logs MongoDB : `tail -f /usr/local/var/log/mongodb/mongo.log`
- Vérifier le statut du service : `brew services list`
- Redémarrer MongoDB : `brew services restart mongodb-community`
