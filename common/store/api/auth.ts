import firebase from 'firebase';
import { Environment, Extra } from '../../../config/types';
import { DeleteAccountSurvey } from '../user/types';
import FirebaseRefs from './FirebaseRefs';

export default class AuthApi {
  constructor(private refs: FirebaseRefs, private auth: firebase.auth.Auth, private extra: Extra) {}

  observeAuthState(handler: (a: firebase.User | null) => any): firebase.Unsubscribe {
    return this.auth.onAuthStateChanged(handler);
  }

  sendSignInLinkToEmail(email: string, environment: Environment): Promise<void> {
    this.auth.languageCode = 'pt'; // i18n
    const domain = `${environment}.deeplink.appjusto.com.br`;
    return this.auth.sendSignInLinkToEmail(email, {
      url: `https://${domain}/${this.extra.flavor}/join`,
      handleCodeInApp: true,
      iOS: {
        bundleId: this.extra.bundleIdentifier,
      },
      android: {
        packageName: this.extra.androidPackage,
        installApp: true,
      },
      dynamicLinkDomain: domain,
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

  getEmail() {
    return this.auth.currentUser?.email;
  }

  signOut() {
    return this.auth.signOut();
  }

  deleteAccount(survey: DeleteAccountSurvey) {
    return this.refs.getDeleteAccountCallable()(survey);
  }
}
