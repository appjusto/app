import firebase from 'firebase';

import { UserProfile, ProfileInfo } from '../user/types';

export default class ProfileApi {
  constructor(
    private firestore: firebase.firestore.Firestore,
    private functions: firebase.functions.Functions,
    private collectionName: string
  ) {}

  // private helpers
  private getProfileRef(id: string) {
    return this.firestore.collection(this.collectionName).doc(id);
  }
  private getProfilePrivateInfoRef(id: string) {
    return this.getProfileRef(id).collection('info').doc('private');
  }
  private createProfile(id: string) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    return this.getProfileRef(id).set({
      timestamp,
    });
  }
  // functions
  // submit profile
  async submitProfile() {
    return this.functions.httpsCallable('submitProfile')({
      collectionName: this.collectionName,
    });
  }

  // firestore
  // observe profile changes
  observeProfile(id: string, resultHandler: (profile: UserProfile) => void): firebase.Unsubscribe {
    const unsubscribe = this.getProfileRef(id).onSnapshot(
      async (doc) => {
        // ensure profile exists
        if (!doc.exists) await this.createProfile(id);
        else resultHandler({ ...doc.data(), id });
      },
      (error) => {
        console.error(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  // observe for private info changes
  observePrivateInfo(
    id: string,
    resultHandler: (profile: ProfileInfo) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.getProfilePrivateInfoRef(id).onSnapshot(
      (doc) => {
        resultHandler(doc.data() as ProfileInfo);
      },
      (error) => {
        console.error(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  // update profile
  updateProfile(id: string, changes: object) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    return this.getProfileRef(id).set(
      {
        ...changes,
        timestamp,
      },
      { merge: true }
    );
  }
}
