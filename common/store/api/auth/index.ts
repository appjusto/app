import { DeleteAccountPayload } from '@appjusto/types';
import {
  ApplicationVerifier,
  Auth,
  isSignInWithEmailLink,
  linkWithCredential,
  onAuthStateChanged,
  PhoneAuthProvider,
  sendSignInLinkToEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signInWithPhoneNumber,
  unlink,
  Unsubscribe,
  User,
} from 'firebase/auth';
import { addDoc, serverTimestamp } from 'firebase/firestore';
import { Extra } from '../../../../config/types';
import { getDeeplinkDomain, getFallbackDomain } from '../../../utils/domains';
import { getAppVersion } from '../../../utils/version';
import { FirestoreRefs } from '../../refs/FirestoreRefs';
import { FunctionsRef } from '../../refs/FunctionsRef';

export type AuthMode = 'passwordless' | 'password' | 'phone';

export default class AuthApi {
  public defaultAuthMode: AuthMode;

  constructor(
    private auth: Auth,
    private firestoreRefs: FirestoreRefs,
    private functionsRef: FunctionsRef,
    private extra: Extra
  ) {
    this.auth.languageCode = 'pt';
    this.defaultAuthMode = extra.flavor === 'business' ? 'password' : 'phone';
  }

  observeAuthState(handler: (a: User | null) => any): Unsubscribe {
    return onAuthStateChanged(this.auth, handler);
  }

  // email sign in
  async sendSignInLinkToEmail(email: string): Promise<void> {
    try {
      await addDoc(this.firestoreRefs.getPlatformLoginLogsRef(), {
        email,
        flavor: this.extra.flavor,
        signInAt: serverTimestamp(),
      });
    } catch (error) {
      // Sentry.Native.captureException(error);
    }
    const { environment, flavor } = this.extra;
    const url = `https://${getFallbackDomain(environment)}/${flavor}/join`;
    return sendSignInLinkToEmail(this.auth, email, {
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
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    return userCredential.user;
  }

  isSignInWithEmailLink(link: string | null): boolean {
    if (!link) return false;
    return isSignInWithEmailLink(this.auth, link);
  }

  async signInWithEmailLink(email: string, link: string) {
    const userCredential = await signInWithEmailLink(this.auth, email, link);
    return userCredential.user;
  }

  // phone

  async signInWithPhoneNumber(
    verifier: ApplicationVerifier,
    phone: string,
    countryCode: string = '55'
  ) {
    return signInWithPhoneNumber(this.auth, `+${countryCode}${phone}`, verifier);
  }

  async verifyPhoneNumber(
    applicationVerifier: ApplicationVerifier,
    phone: string,
    countryCode: string = '55'
  ) {
    const phoneProvider = new PhoneAuthProvider(this.auth);
    return phoneProvider.verifyPhoneNumber(`+${countryCode}${phone}`, applicationVerifier);
  }

  async confirmPhoneSignIn(verificationId: string, verificationCode: string) {
    const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
    if (this.auth.currentUser) {
      if (this.getPhoneNumber()) await unlink(this.auth.currentUser!, 'phone');
      await linkWithCredential(this.auth.currentUser, credential);
    } else {
      await signInWithCredential(this.auth, credential);
    }
  }

  getUserId() {
    return this.auth.currentUser?.uid;
  }

  getEmail() {
    return this.auth.currentUser?.email;
  }

  getPhoneNumber(stripCountryCode: boolean = false) {
    const phone = this.auth.currentUser?.phoneNumber;
    if (!phone || !stripCountryCode || phone.indexOf('+') !== 0) return phone;
    return phone.slice(3);
  }

  signOut() {
    return this.auth.signOut();
  }

  deleteAccount(payload: Partial<DeleteAccountPayload>) {
    return this.functionsRef.getDeleteAccountCallable()({
      ...payload,
      meta: { version: getAppVersion() },
    });
  }
}
