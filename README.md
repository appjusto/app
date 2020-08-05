# 1. Clone repo and install dependecies

```bash
git clone git@github.com:appjusto/app.git
cd app
npm install
```

# 2. Configure .env

```bash
GOOGLE_MAPS_API_KEY=
FIREBASE_REGION=
FIREBASE_API_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_DATABASE_NAME=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
FIREBASE_MEASUREMENT_ID=
```

# 3. Running locally

```bash
# using firebase cloud
FLAVOR=<consumer | courier> expo start -c

# using firabase local emulator (also running expo with tunnel)
FLAVOR=<consumer | courier> FIREBASE_EMULATOR=true expo start --tunnel -c

# Deeplink testing
xcrun simctl openurl booted "exp://192.168.15.3:19000/--/?link=<link>"
```

# 4. Building locally

```bash
# fetch keys
FLAVOR=consumer expo fetch:android:keystore
FLAVOR=courier expo fetch:android:keystore

# configure environment variables
export EXPO_USERNAME=
export EXPO_PASSWORD=
export EXPO_ANDROID_KEYSTORE_PASSWORD=
export EXPO_ANDROID_KEY_PASSWORD=

# install turtle
npm install -g turtle-cli

# build Android
FLAVOR=consumer turtle build:android -t apk --keystore-path <path-to-keystore> --keystore-alias <keystore-alias>
```

Docs:

- https://docs.expo.io/distribution/turtle-cli/
- https://docs.expo.io/distribution/building-standalone-apps/
