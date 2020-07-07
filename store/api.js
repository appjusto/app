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
    // SECURITY TODO: this action should be restricted only to the courier himself and admins
    const courierDoc = this.db.collection('couriers').doc(courier.uid);
    // TODO: create a job to synthesize or remove old data
    courierDoc.collection('locationHistory').add({...coords, courier: courier.uid, timestamp});

    // TODO: what about geting the most recent from locationHistory instead?
    return courierDoc.update({
      lastKnownLocation: coords
    });
  }

  fetchAvailableCouriers(resultHandler) {
    // TODO: add query filters to limit to couriers:
    // 1 close to a specific location
    // 2 max number of results
    const unsubscribe = this.db.collection('couriers')
      .where('available', '==', true)
      .onSnapshot((snapshot) => {
        const result = [];
        snapshot.forEach((doc) => {
          result.push({...doc.data(), uid: doc.ref.path});
        });
        resultHandler(result)
      });
    // returns the unsubscribe function
    return unsubscribe;
  }
}

export const ApiContext = React.createContext();