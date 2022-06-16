import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import * as geofirestore from 'geofirestore';
import { Platform } from 'react-native';
import { Extra } from '../../../config/types';

export default class GeoFirestoreApi {
  private geofirestore: geofirestore.GeoFirestore;
  constructor(extra: Extra) {
    const apiKey =
      Platform.OS === 'android' ? extra.firebase.apiKeyAndroid : extra.firebase.apiKeyiOS;
    const app = firebase.initializeApp({ ...extra.firebase, apiKey });

    this.geofirestore = geofirestore.initializeApp(app.firestore());
  }
  public getGeoFirestore() {
    return this.geofirestore;
  }
}
