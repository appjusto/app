import { DeleteAccountPayload } from '@appjusto/types';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
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
    private firestoreRefs: FirestoreRefs,
    private functionsRef: FunctionsRef,
    private extra: Extra
  ) {
    auth().languageCode = 'pt';
    this.defaultAuthMode = extra.flavor === 'business' ? 'password' : 'phone';
  }

  observeAuthState(handler: (a: FirebaseAuthTypes.User | null) => unknown) {
    return auth().onAuthStateChanged(handler);
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
    return auth().sendSignInLinkToEmail(email, {
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
    try {
      await addDoc(this.firestoreRefs.getPlatformLoginLogsRef(), {
        email,
        flavor: this.extra.flavor,
        signInAt: serverTimestamp(),
      });
    } catch (error) {
      // Sentry.Native.captureException(error);
    }
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    return userCredential.user;
  }

  // phone

  async signInWithPhoneNumber(number: string, countryCode: string = '55') {
    const phone = `+${countryCode}${number}`;
    return auth().signInWithPhoneNumber(phone);
  }

  async verifyPhoneNumber(phone: string, countryCode = '55') {
    return auth().verifyPhoneNumber(`+${countryCode}${phone}`);
  }

  async confirmPhoneSignIn(verificationId: string, verificationCode: string) {
    const credential = auth.PhoneAuthProvider.credential(verificationId, verificationCode);
    const currentUser = auth().currentUser;
    if (currentUser) {
      if (this.getPhoneNumber()) await currentUser.unlink('phone');
      await currentUser.linkWithCredential(credential);
    }
  }

  getCurrentUser() {
    return auth().currentUser;
  }

  getUserId() {
    return this.getCurrentUser()?.uid;
  }

  getEmail() {
    return this.getCurrentUser()?.email;
  }

  getPhoneNumber(stripCountryCode = false) {
    const phone = this.getCurrentUser()?.phoneNumber;
    if (!phone || !stripCountryCode || phone.indexOf('+') !== 0) return phone;
    return phone.slice(3);
  }

  signOut() {
    return auth().signOut();
  }

  deleteAccount(payload: Partial<DeleteAccountPayload>) {
    return this.functionsRef.getDeleteAccountCallable()({
      ...payload,
      meta: { version: getAppVersion() },
    });
  }
}
