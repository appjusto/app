import firebase from 'firebase';
import * as geofirestore from 'geofirestore';

import { CourierProfile, Bank } from '../courier/types';

export default class CourierApi {
  private firestoreWithGeo: geofirestore.GeoFirestore;

  constructor(
    private firestore: firebase.firestore.Firestore,
    private functions: firebase.functions.Functions
  ) {
    this.firestoreWithGeo = geofirestore.initializeApp(this.firestore);
  }

  // firestore
  // fetch supported banks
  async fetchBanks() {
    const querySnapshot = await this.firestore.collection('banks').get();
    const docs: Bank[] = [];
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        docs.push({ ...(doc.data() as Bank), id: doc.id });
      });
    }
    return docs;
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
    const { maxDistance, maxDistanceToOrigin } = courier.fleet ?? {
      maxDistance: 0,
      maxDistanceToOrigin: 0,
    };
    // no reason to update courier's location if token is unknown
    if (notificationToken) {
      courierLocationRef.set(
        {
          notificationToken,
          maxDistance,
          maxDistanceToOrigin,
          coordinates: new firebase.firestore.GeoPoint(coords.latitude, coords.longitude),
          // accuracy: coords.accuracy,
          // altitude: coords.altitude,
          // altitudeAccuracy: coords.altitudeAccuracy,
          // heading: coords.heading,
          // speed: coords.speed,
          timestamp,
        },
        { merge: true }
      );
    }
  }
}
