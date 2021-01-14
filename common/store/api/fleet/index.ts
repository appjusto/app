import { Fleet, WithId } from 'appjusto-types';
import firebase from 'firebase';
import FirebaseRefs from '../FirebaseRefs';
import { documentAs, documentsAs, FirebaseDocument } from '../types';

type FetchFleetsOptions = {
  startAfter?: FirebaseDocument;
  search?: string;
};

export default class FleetApi {
  constructor(private refs: FirebaseRefs) {}

  // firestore
  async fetchFleets(options?: FetchFleetsOptions) {
    let query = this.refs.getFleetsRef().where('situation', '==', 'approved');
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
    // we're not converting to plain objects be cause we need the to paginate
    return (await query.get()).docs;
  }
  observeFleet(
    fleetId: string,
    resultHandler: (orders: WithId<Fleet>) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs.getFleetRef(fleetId).onSnapshot(
      (snapshot) => resultHandler(documentAs<Fleet>(snapshot)),
      (error) => console.error(error)
    );
    // returns the unsubscribe function
    return unsubscribe;
  }
  observeFleets(resultHandler: (orders: WithId<Fleet>[]) => void): firebase.Unsubscribe {
    const query = this.refs
      .getFleetsRef()
      .where('situation', '==', 'approved')
      .orderBy('participantsOnline', 'desc')
      .limit(3);

    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        resultHandler(documentsAs<WithId<Fleet>>(querySnapshot.docs));
      },
      (error) => {
        console.error(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  async createFleet(fleet: Partial<Fleet>) {
    return this.refs.getFleetsRef().add(fleet);
  }
}
