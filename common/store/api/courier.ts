import { Bank, LatLng, WithId } from 'appjusto-types';
import firebase from 'firebase';

type FetchTotalCouriersNearbyData = {
  total: number;
};

export default class CourierApi {
  constructor(
    private firestore: firebase.firestore.Firestore,
    private functions: firebase.functions.Functions
  ) {}

  // functions
  // submit profile
  async submitProfile() {
    return this.functions.httpsCallable('submitProfile')();
  }

  async fetchTotalCouriersNearby(
    location: LatLng,
    distance: number = 15000
  ): Promise<FetchTotalCouriersNearbyData> {
    return (await this.functions.httpsCallable('fetchTotalCouriersNearby')({ location, distance }))
      .data;
  }

  // firestore
  // fetch supported banks
  async fetchBanks() {
    const querySnapshot = await this.firestore.collection('banks').get();
    const docs: WithId<Bank>[] = [];
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        docs.push({ ...(doc.data() as Bank), id: doc.id });
      });
    }
    return docs;
  }
}
