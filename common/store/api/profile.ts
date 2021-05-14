import { ConsumerProfile, CourierProfile, Flavor, UserProfile, WithId } from '@appjusto/types';
import firebase from 'firebase';
import * as geofirestore from 'geofirestore';
import * as Sentry from 'sentry-expo';
import AuthApi from './auth';
import { documentAs } from './types';

export default class ProfileApi {
  private firestoreWithGeo: geofirestore.GeoFirestore;
  private collectionName: string;
  constructor(
    private firestore: firebase.firestore.Firestore,
    private auth: AuthApi,
    public flavor: Flavor
  ) {
    this.firestoreWithGeo = geofirestore.initializeApp(this.firestore);
    this.collectionName = this.flavor === 'consumer' ? 'consumers' : 'couriers';
  }

  // private helpers
  private getProfileRef(id: string) {
    return this.firestore.collection(this.collectionName).doc(id);
  }
  private async createProfile(id: string) {
    await this.getProfileRef(id).set({
      situation: 'pending',
      email: this.auth.getEmail(),
    } as UserProfile);
  }

  // firestore
  // observe profile changes
  observeProfile(
    id: string,
    resultHandler: (profile: WithId<UserProfile>) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.getProfileRef(id).onSnapshot(
      async (doc) => {
        // ensure profile exists
        if (!doc.exists) await this.createProfile(id);
        else resultHandler(documentAs<UserProfile>(doc));
      },
      (error) => {
        console.log(error);
        Sentry.Native.captureException(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  // update profile
  updateProfile(id: string, changes: Partial<CourierProfile> | Partial<ConsumerProfile>) {
    return this.getProfileRef(id).set(
      { ...changes, updatedOn: firebase.firestore.FieldValue.serverTimestamp() } as UserProfile,
      { merge: true }
    );
  }

  updateLocation(id: string, location: firebase.firestore.GeoPoint) {
    return this.firestoreWithGeo
      .collection(this.collectionName)
      .doc(id)
      .update({
        coordinates: location,
        updatedOn: firebase.firestore.FieldValue.serverTimestamp(),
      } as UserProfile);
  }
}
