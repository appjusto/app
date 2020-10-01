import { Fleet, City, WithId } from 'appjusto-types';
import firebase from 'firebase';

export default class FleetApi {
  constructor(
    private firestore: firebase.firestore.Firestore,
    private functions: firebase.functions.Functions
  ) {}

  // firestore
  observeFleets(resultHandler: (orders: WithId<Fleet>[]) => void): firebase.Unsubscribe {
    const query = this.firestore
      .collection('fleets')
      .where('situation', '==', 'approved')
      .orderBy('participantsOnline', 'desc');

    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        const docs: WithId<Fleet>[] = [];
        querySnapshot.forEach((doc) => {
          docs.push({ ...(doc.data() as Fleet), id: doc.id });
        });
        resultHandler(docs);
      },
      (error) => {
        console.error(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  async createFleet(fleet: Partial<Fleet>) {
    return this.firestore.collection('fleets').add(fleet);
  }
}
