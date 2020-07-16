import React from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import axios from 'axios';
import { Courier, Place } from './types';

export default class Api {
  db: firebase.firestore.Firestore;
  functionsURL: string;
  googleMapsApiKey: string;

  constructor(firebaseConfig, googleMapsApiKey: string) {
    firebase.initializeApp(firebaseConfig);
    this.db = firebase.firestore();

    this.functionsURL = firebaseConfig.functionsURL;
    this.googleMapsApiKey = googleMapsApiKey;

    if (firebaseConfig.emulator.enabled) {
      this.db.settings({
        host: firebaseConfig.emulator.databaseURL,
        ssl: false,
      });
      // this is the advertised way to do it but is throwing an excepting for any reason
      // firebase.functions().useFunctionsEmulator(firebaseConfig.emulator.functionsURL);
      this.functionsURL = firebaseConfig.emulator.functionsURL;
    }
  }

  updateCourierStatus(courier, status) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const courierDoc = this.db.collection('couriers').doc(courier.id);
    return courierDoc.set({
      status,
      timestamp
    }, { merge: true });
  }

  updateCourierLocation(courier:Courier, location) {
    const { coords } = location;

    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    // SECURITY TODO: this action should be restricted only to the courier himself and admins
    // TODO: create a job to synthesize or remove old data
    this.db.collection('locations').add({
      ...coords,
      courierId: courier.id,
      timestamp
    });
  }

  watchCourier(courier:Courier, resultHandler) {
    // TODO: ensure only people envolved in order are able to know courier's location
    const unsubscribe = this.db.collection('couriers').doc(courier.id)
      .onSnapshot((doc) => {
        resultHandler({...doc.data(), id: doc.id})
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
          result.push({...doc.data(), id: doc.id});
        });
        resultHandler(result)
      });
    // returns the unsubscribe function
    return unsubscribe;
  }

  async createOrder(origin: Place, destination: Place) {
    const params = {
      origin,
      destination,
    }
    try {
      const url = `${this.functionsURL}/createOrder`;
      const response = await axios.post(url, params);
      return response.data;
    }
    catch(err) {
      console.log(err);
      return err;
    }
  }

  async googlePlacesAutocomplete(input: string, sessiontoken: string) {
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

  async googleGeocode(address: string) {
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

export const ApiContext = React.createContext(null);