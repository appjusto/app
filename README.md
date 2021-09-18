# 1. Clone repo and install dependecies

```bash
git clone git@github.com:appjusto/app.git
cd app
npm install
```

# 2. Configure .env

```bash
FIREBASE_API_KEY=
FIREBASE_REGION=
FIREBASE_PROJECT_ID=
FIREBASE_DATABASE_NAME=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_CONSUMER_APP_ID=
FIREBASE_CONSUMER_MEASUREMENT_ID=
FIREBASE_COURIER_APP_ID=
FIREBASE_COURIER_MEASUREMENT_ID=
GOOGLE_MAPS_API_KEY=
IUGU_ACCOUNT_ID=
ALGOLIA_APPID=
ALGOLIA_APIKEY=
SENTRY_DSN=
SENTRY_AUTH_TOKEN=
SEGMENT_CONSUMER_IOS_KEY=
SEGMENT_CONSUMER_ANDROID_KEY=
SEGMENT_COURIER_IOS_KEY=
SEGMENT_COURIER_ANDROID_KEY=
ENVIRONMENT=
```

# 3. Running locally

```bash
# using firebase cloud
FLAVOR=<consumer | courier> expo start -c

# using firabase local emulator (also running expo with tunnel)
FLAVOR=<consumer | courier> FIREBASE_EMULATOR=true expo start --tunnel -c

# Deeplink testing
xcrun simctl openurl booted "exp://<local-ip-address>:19000/--/?link=<link>"
adb shell am start -a "android.intent.action.VIEW" -d "exp://<local-ip-address>:19000/--/?link=<link>"
```

# 4. Publishing

FLAVOR=consumer expo publish
FLAVOR=courier expo publish

# 5. Building locally

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

# 6. Building on expo

Edit `app.config.js` and update version and versionCode and run:

```bash
# consumer ios
FLAVOR=consumer expo build:ios -t archive
# consumer android apk
FLAVOR=consumer expo build:android -t apk
# consumer android app-bundle
FLAVOR=consumer expo build:android -t app-bundle

# courier ios
FLAVOR=courier expo build:ios -t archive
# courier android apk
FLAVOR=courier expo build:android -t apk
# courier android app-bundle
FLAVOR=courier expo build:android -t app-bundle
```

# 7. Bulding with eas

```bash
cat .dev.env | grep "=" | awk -F "=" '{print "--name="$1" --value="$2}' | FLAVOR=courier xargs -n2 eas secret:create --force
```
