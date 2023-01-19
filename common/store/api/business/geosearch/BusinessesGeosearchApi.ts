import { BusinessProfile, CuisineName, LatLng, WithDistance, WithId } from '@appjusto/types';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import * as geofirestore from 'geofirestore';
import GeoFirestoreApi from '../../GeoFirestoreApi';

interface FetchBusinessesAroundOptions {
  location: LatLng;
  page?: number;
  cuisine?: CuisineName;
}

export default class BusinessesGeosearchApi {
  private geofirestore: geofirestore.GeoFirestore;
  constructor(geofirestoreapi: GeoFirestoreApi) {
    this.geofirestore = geofirestoreapi.getGeoFirestore();
  }
  async fetchBusinessesAround({ location, cuisine, page = 1 }: FetchBusinessesAroundOptions) {
    console.log('fetchBusinessesAround', page);
    const { latitude, longitude } = location;
    const limit = page * 50;
    let query = this.geofirestore
      .collection('businesses-profiles')
      .where('enabled', '==', true)
      .near({ center: new firebase.firestore.GeoPoint(latitude, longitude), radius: 25, limit })
      .limit(limit);
    if (cuisine) query = query.where('cuisine', '==', cuisine);
    const snapshot = await query.get();
    if (snapshot.empty) return [];
    const docs = snapshot.docs.sort((a, b) => a.distance - b.distance);
    // console.log(docs.map((d) => d.data().name));
    return docs.map(
      (doc) =>
        ({ ...doc.data(), id: doc.id, distance: doc.distance } as WithDistance<
          WithId<BusinessProfile>
        >)
    );
  }
}
