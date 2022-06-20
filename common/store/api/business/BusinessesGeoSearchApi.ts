import { Business, LatLng, WithId } from '@appjusto/types';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import * as geofirestore from 'geofirestore';
import GeoFirestoreApi from '../GeoFirestoreApi';

export default class BusinessesGeoSearchApi {
  private geofirestore: geofirestore.GeoFirestore;
  constructor(geofirestoreapi: GeoFirestoreApi) {
    this.geofirestore = geofirestoreapi.getGeoFirestore();
  }
  async fetchBusinessesAround({ latitude, longitude }: LatLng, n: number = 0, cuisine?: string) {
    const limit = n === 0 ? 50 : n + 15;
    let query = this.geofirestore
      .collection('businesses')
      .where('situation', '==', 'approved')
      .where('enabled', '==', true)
      .near({ center: new firebase.firestore.GeoPoint(latitude, longitude), radius: 25, limit })
      .limit(limit);
    if (cuisine) query = query.where('cuisine', '==', cuisine);
    const snapshot = await query.get();
    if (snapshot.empty) return [];
    const docs = snapshot.docs.sort((a, b) => a.distance - b.distance);
    return docs.map((doc) => ({ ...doc.data(), id: doc.id } as WithId<Business>));
  }
}
