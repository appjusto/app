import React from 'react';
import firebase from 'firebase';
import 'firebase/firestore';

export default class Api {
  constructor(firebaseConfig) {
    firebase.initializeApp(firebaseConfig);
    this.db = firebase.firestore();
  }

  broadcastCourierLocation(courier, location) {
    const { coords } = location;

    console.log('Saving location: ', courier.uid, coords);
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const courierDoc = this.db.collection('couriers').doc(courier.uid);
    courierDoc.collection('locationHistory').add({...coords, courier: courier.uid, timestamp});

    return courierDoc.set({
      lastKnownLocation: coords,
      timestamp,
    }, { merge: true });
  }

  async fetchVisibleCouriers() {
    // TODO: limit to a specific number close to a location
    const querySnapshot = await this.db.collection('couriers').get();
    return querySnapshot.docs.map((snapshot) => ({ ...snapshot.data(), uid: snapshot.ref.path }));
  }
}

export const ApiContext = React.createContext();