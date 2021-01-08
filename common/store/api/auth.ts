import firebase from 'firebase';
import { Extra } from '../../utils/config';
import { DeleteAccountSurvey } from '../user/types';
import FirebaseRefs from './FirebaseRefs';

export default class AuthApi {
  constructor(private refs: FirebaseRefs, private auth: firebase.auth.Auth, private extra: Extra) {}

  observeAuthState(handler: (a: firebase.User | null) => any): firebase.Unsubscribe {
    return this.auth.onAuthStateChanged(handler);
  }

  sendSignInLinkToEmail(email: string): Promise<void> {
    this.auth.languageCode = 'pt'; // i18n
    return this.auth.sendSignInLinkToEmail(email, {
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
    return this.auth.isSignInWithEmailLink(link);
  }

  async signInWithEmailLink(email: string, link: string) {
    const userCredential = await this.auth.signInWithEmailLink(email, link);
    return userCredential.user;
  }

  signOut() {
    return this.auth.signOut();
  }

  deleteAccount(survey: DeleteAccountSurvey) {
    return this.refs.getDeleteAccountCallable()(survey);
  }
}
