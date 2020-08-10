import firebase from 'firebase';
import * as geofirestore from 'geofirestore';

import { CourierProfile } from '../courier/types';

export default class CourierApi {
  private firestoreWithGeo: geofirestore.GeoFirestore;

  constructor(
    private firestore: firebase.firestore.Firestore,
    private functions: firebase.functions.Functions
  ) {
    this.firestoreWithGeo = geofirestore.initializeApp(this.firestore);
  }

  // firestore
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
