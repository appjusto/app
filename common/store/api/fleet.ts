import { Fleet, WithId } from 'appjusto-types';
import firebase from 'firebase';

import { FirebaseDocument } from './types';

type FetchFleetsOptions = {
  startAfter?: FirebaseDocument;
  search?: string;
};

export default class FleetApi {
  constructor(
    private firestore: firebase.firestore.Firestore,
    private functions: firebase.functions.Functions
  ) {}

  // firestore
  async fetchFleets(options?: FetchFleetsOptions) {
    // console.log(options);
    console.log('fetchFleets: ', options?.search);
    let query = this.firestore.collection('fleets').where('situation', '==', 'approved');
    if (options?.search) {
      query = query
        .where('name', '>=', options?.search)
        .where('name', '<=', `${options?.search}\uf8ff`)
        .orderBy('name', 'asc');
    }
    query = query.orderBy('participantsOnline', 'desc');
    if (options?.startAfter) {
      query = query.startAfter(options.startAfter);
    }
    query = query.limit(1); // TODO: increase it; temporary to make sure it's working with few fleets
    return (await query.get()).docs;
  }

  observeFleets(resultHandler: (orders: WithId<Fleet>[]) => void): firebase.Unsubscribe {
    const query = this.firestore
      .collection('fleets')
      .where('situation', '==', 'approved')
      .orderBy('participantsOnline', 'desc')
      .limit(3);

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
