import firebase from 'firebase';

import { Extra } from '../../utils/config';

export default class AuthApi {
  constructor(private extra: Extra) {}

  observeAuthState(handler: (a: firebase.User | null) => any): firebase.Unsubscribe {
    return firebase.auth().onAuthStateChanged(handler);
  }

  sendSignInLinkToEmail(email: string): Promise<void> {
    firebase.auth().languageCode = 'pt'; // i18n
    return firebase.auth().sendSignInLinkToEmail(email, {
      url: `https://deeplink.appjusto.com.br/${this.extra.flavor}/join?something=else'`,
      handleCodeInApp: true,
      iOS: {
        bundleId: this.extra.bundleIdentifier,
      },
      android: {
        packageName: this.extra.androidPackage,
        installApp: true,
      },
      dynamicLinkDomain: 'deeplink.appjusto.com.br',
    });
  }

  isSignInWithEmailLink(link: string | null): boolean {
    if (!link) return false;
    return firebase.auth().isSignInWithEmailLink(link);
  }

  async signInWithEmailLink(email: string, link: string) {
    const userCredential = await firebase.auth().signInWithEmailLink(email, link);
    return userCredential.user;
  }

  signOut() {
    return firebase.auth().signOut();
  }
}
