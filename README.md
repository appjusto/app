# 1. Clonar repositório e instalar dependências

```
git clone git@github.com:appjusto/app.git
cd app
npm install
```

# 2. Configurar .env

```
GOOGLE_MAPS_API_KEY=
FIREBASE_REGION=
FIREBASE_API_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_DATABASE_NAME=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
FIREBASE_MEASUREMENT_ID=
```

# 3. Rodar projeto

```
expo start -c
FLAVOR=consumer FIREBASE_EMULATOR=true expo start --tunnel -c # iniciando como consumer e usando backend local
```