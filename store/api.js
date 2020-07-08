import React from 'react';
import firebase from 'firebase';
import 'firebase/firestore';

export default class Api {
  constructor(firebaseConfig) {
    firebase.initializeApp(firebaseConfig);
    this.db = firebase.firestore();
  }

  updateCourierStatus(courier, status) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const courierDoc = this.db.collection('couriers').doc(courier.uid);
    return courierDoc.update({
      status,
      timestamp
    });
  }

  updateCourierLocation(courier, location) {
    const { coords } = location;

    console.log('Saving location: ', courier.uid, coords);
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    // SECURITY TODO: this action should be restricted only to the courier himself and admins
    const courierDoc = this.db.collection('couriers').doc(courier.uid);
    // TODO: create a job to synthesize or remove old data
    courierDoc.collection('locationHistory').add({...coords, courier: courier.uid, timestamp});

    // TODO: what about geting the most recent from locationHistory instead?
    return courierDoc.update({
      lastKnownLocation: coords,
      timestamp
    });
  }

  watchCourier(courier, resultHandler) {
    const unsubscribe = this.db.collection('couriers').doc(courier.id)
      .onSnapshot((doc) => {
        resultHandler({...doc.data(), uid: doc.ref.path})
      });
    // returns the unsubscribe function
    return unsubscribe;
  }

  watchAvailableCouriers(resultHandler) {
    // TODO: add query filters to limit to couriers:
    // 1 close to a specific location
    // 2 max number of results
    const unsubscribe = this.db.collection('couriers')
      .where('status', '==', 'available')
      .onSnapshot((query) => {
        const result = [];
        query.forEach((doc) => {
          result.push({...doc.data(), uid: doc.ref.path});
        });
        resultHandler(result)
      });
    // returns the unsubscribe function
    return unsubscribe;
  }
}

export const ApiContext = React.createContext();