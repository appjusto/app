import { Fleet, WithId } from 'appjusto-types';
import firebase from 'firebase';
import FirebaseRefs from '../FirebaseRefs';
import { documentAs, documentsAs } from '../types';
import { ObserveFleetOptions } from './types';

export default class FleetApi {
  constructor(private refs: FirebaseRefs) {}

  // firestore
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
  observeFleets(
    resultHandler: (
      result: WithId<Fleet>[],
      last?: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
    ) => void,
    options: ObserveFleetOptions
  ): firebase.Unsubscribe {
    const { fleetsIds, startAfter, limit = 10 } = options;
    let query = this.refs
      .getFleetsRef()
      .where('situation', '==', 'approved')
      .where(firebase.firestore.FieldPath.documentId(), 'in', fleetsIds)
      .orderBy(firebase.firestore.FieldPath.documentId())
      .limit(limit);
    if (startAfter) query = query.startAfter(startAfter);

    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        const last =
          querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.size - 1] : undefined;
        resultHandler(documentsAs<WithId<Fleet>>(querySnapshot.docs), last);
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
