import React from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import axios from 'axios';

export default class Api {
  constructor(firebaseConfig, googleMapsApiKey) {
    firebase.initializeApp(firebaseConfig);
    this.db = firebase.firestore();
    this.googleMapsApiKey = googleMapsApiKey;
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

  async googlePlacesAutocomplete(input, sessiontoken) {
    // TODO: location & radius?
    const url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
    const params = {
      key: this.googleMapsApiKey,
      input,
      sessiontoken,
      types: 'address',
      components: 'country:BR', // i18n
      language: 'pt-BR', // i18n
    }
    try {
      const response = await axios.get(url, { params });
      return response.data;
    }
    catch(err) {
      console.log(err);
      return err;
    }
  }

  async googleGeocode(address) {
    const url = 'https://maps.googleapis.com/maps/api/geocode/json';
    const params = {
      key: this.googleMapsApiKey,
      address,
      region: 'br', // i18n
      components: 'country:BR', // i18n
      language: 'pt-BR', // i18n
    }
    try {
      const response = await axios.get(url, { params });
      const { data } = response;
      const { results } = data;
      const [result] = results;
      const { geometry } = result;
      const { location } = geometry;
      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    }
    catch(err) {
      console.log(err);
      return err;
    }
  }
}

export const ApiContext = React.createContext();