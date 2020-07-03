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

    console.log('Saving location: ', courier.id, coords);
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    this.db.collection('locations').add({...coords, courier: courier.id, timestamp});
    return this.db.collection('couriers').doc(courier.id).set({
      lastKnownLocation: coords,
      timestamp,
    }, { merge: true });
  }

  async fetchVisibleCouriers() {
    const querySnapshot = await this.db.collection('couriers').get();
    return querySnapshot.docs.map((snapshot) => ({ ...snapshot.data(), id: snapshot.ref.path }));
  }
}

export const ApiContext = React.createContext();