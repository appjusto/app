import { Fleet, City } from 'appjusto-types';
import firebase from 'firebase';

export default class FleetApi {
  constructor(
    private firestore: firebase.firestore.Firestore,
    private functions: firebase.functions.Functions
  ) {}

  // firestore
  // fetch available cities
  async fetchAvailableCities() {
    const querySnapshot = await this.firestore
      .collection('config')
      .doc('cities')
      .collection('available')
      .get();
    const docs: City[] = [];
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        docs.push({ ...(doc.data() as City), id: doc.id });
      });
    }
    return docs;
  }
  // fetch all cities
  async fetchAllCities() {
    const querySnapshot = await this.firestore
      .collection('config')
      .doc('cities')
      .collection('all')
      .get();
    const docs: City[] = [];
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        docs.push({ ...(doc.data() as City), id: doc.id });
      });
    }
    return docs;
  }

  // fetch available fleets
  async fetchApprovedFleets() {
    const querySnapshot = await this.firestore
      .collection('fleets')
      .where('situation', '==', 'approved')
      .orderBy('participantsOnline', 'desc')
      .get();
    const docs: Fleet[] = [];
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        docs.push({ ...(doc.data() as Fleet), id: doc.id });
      });
    }
    return docs;
  }

  async createFleet(fleet: Fleet) {
    return this.firestore.collection('fleets').add(fleet);
  }
}
