import { DeleteAccountPayload } from '@appjusto/types';
import Constants from 'expo-constants';
import firebase from 'firebase';
// import * as Sentry from 'sentry-expo';
import { Extra } from '../../../config/types';
import { getDeeplinkDomain, getFallbackDomain } from '../../utils/domains';
import FirebaseRefs from './FirebaseRefs';

export default class AuthApi {
  constructor(private refs: FirebaseRefs, private auth: firebase.auth.Auth, private extra: Extra) {
    this.auth.languageCode = 'pt';
  }

  observeAuthState(handler: (a: firebase.User | null) => any): firebase.Unsubscribe {
    return this.auth.onAuthStateChanged(handler);
  }

  // email sign in
  async sendSignInLinkToEmail(email: string): Promise<void> {
    try {
      await this.refs.getPlatformLoginLogsRef().add({
        email,
        flavor: this.extra.flavor,
        signInAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      // Sentry.Native.captureException(error);
    }
    const { environment, flavor } = this.extra;
    const url = `https://${getFallbackDomain(environment)}/${flavor}/join`;
    return this.auth.sendSignInLinkToEmail(email, {
      url,
      handleCodeInApp: true,
      iOS: {
        bundleId: this.extra.bundleIdentifier,
      },
      android: {
        packageName: this.extra.androidPackage,
        installApp: false,
      },
      dynamicLinkDomain: getDeeplinkDomain(environment),
    });
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
    return userCredential.user;
  }

  isSignInWithEmailLink(link: string | null): boolean {
    if (!link) return false;
    return this.auth.isSignInWithEmailLink(link);
  }

  async signInWithEmailLink(email: string, link: string) {
    const userCredential = await this.auth.signInWithEmailLink(email, link);
    return userCredential.user;
  }

  async linkCredential(credential: firebase.auth.AuthCredential) {
    if (this.getPhoneNumber()) await this.auth.currentUser!.unlink('phone');
    await this.auth.currentUser!.linkWithCredential(credential);
  }

  getUserId() {
    return this.auth.currentUser?.uid;
  }

  getEmail() {
    return this.auth.currentUser?.email;
  }

  getPhoneNumber() {
    return this.auth.currentUser?.phoneNumber;
  }

  signOut() {
    return this.auth.signOut();
  }

  deleteAccount(payload: Partial<DeleteAccountPayload>) {
    return this.refs.getDeleteAccountCallable()({
      ...payload,
      meta: { version: Constants.nativeBuildVersion },
    });
  }
}
