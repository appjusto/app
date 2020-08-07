import firebase from 'firebase';
import * as geofirestore from 'geofirestore';

import { CourierProfile } from '../courier/types/Courier';

export default class CourierApi {
  private firestoreWithGeo: geofirestore.GeoFirestore;

  constructor(private firestore: firebase.firestore.Firestore) {
    this.firestoreWithGeo = geofirestore.initializeApp(this.firestore);
  }

  // private helpers
  private getCourierRef(courierId: string) {
    return this.firestore.collection('couriers').doc(courierId);
  }
  private getCourierPrivateInfoRef(courierId: string) {
    return this.getCourierRef(courierId).collection('info').doc('private');
  }

  // create courier profile
  createCourier(courierId: string) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    return this.getCourierRef(courierId).set({
      timestamp,
    });
  }

  // observe courier profile changes
  observeCourier(
    courierId: string,
    resultHandler: (courier: CourierProfile) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.getCourierRef(courierId).onSnapshot(
      async (doc) => {
        // ensure courier exists
        if (!doc.exists) await this.createCourier(courierId);
        else resultHandler({ ...doc.data(), id: courierId });
      },
      (error) => {
        console.error(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  // observe for courier private info changes
  observeCourierPrivateInfo(
    courierId: string,
    resultHandler: (courier: CourierProfile) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.getCourierPrivateInfoRef(courierId).onSnapshot(
      (doc) => {
        resultHandler({ id: courierId, info: doc.data() });
      },
      (error) => {
        console.error(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  // update courier profile
  updateCourier(courierId: string, changes: object) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    return this.getCourierRef(courierId).set(
      {
        ...changes,
        timestamp,
      },
      { merge: true }
    );
  }

  // update courier location
  updateCourierLocation(courier: CourierProfile, location) {
    const { coords } = location;

    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const courierLocationRef = this.firestoreWithGeo
      .collection('locations')
      .doc('couriers')
      .collection(courier.status!)
      .doc(courier.id);

    const { notificationToken } = courier;
    return courierLocationRef.set(
      Object.assign(
        {
          coordinates: new firebase.firestore.GeoPoint(coords.latitude, coords.longitude),
          // accuracy: coords.accuracy,
          // altitude: coords.altitude,
          // altitudeAccuracy: coords.altitudeAccuracy,
          // heading: coords.heading,
          // speed: coords.speed,
          timestamp,
        },
        notificationToken ? { notificationToken } : null
      ),
      { merge: true }
    );
  }
}
