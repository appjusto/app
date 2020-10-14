import { UserProfile, CourierProfile, ConsumerProfile, WithId } from 'appjusto-types';
import firebase from 'firebase';
import * as geofirestore from 'geofirestore';

export default class ProfileApi {
  private firestoreWithGeo: geofirestore.GeoFirestore;
  constructor(
    private firestore: firebase.firestore.Firestore,
    private functions: firebase.functions.Functions,
    private collectionName: string
  ) {
    this.firestoreWithGeo = geofirestore.initializeApp(this.firestore);
  }

  // private helpers
  private getProfileRef(id: string) {
    return this.firestore.collection(this.collectionName).doc(id);
  }
  private async createProfile(id: string) {
    await this.getProfileRef(id).set({
      situation: 'pending',
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
        else resultHandler({ ...(doc.data() as UserProfile), id });
      },
      (error) => {
        console.error(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  // update profile
  updateProfile(id: string, changes: Partial<CourierProfile> | Partial<ConsumerProfile>) {
    return this.getProfileRef(id).set(
      { ...changes, updatedOn: firebase.firestore.FieldValue.serverTimestamp() } as CourierProfile,
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
      } as Partial<CourierProfile>);
  }
}
