import { Bank } from 'appjusto-types';
import firebase from 'firebase';

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

  // firestore
  // fetch supported banks
  async fetchBanks() {
    const querySnapshot = await this.firestore.collection('banks').get();
    const docs: Bank[] = [];
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        docs.push({ ...(doc.data() as Bank), id: doc.id });
      });
    }
    return docs;
  }
}
