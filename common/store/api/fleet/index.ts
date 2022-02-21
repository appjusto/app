import { Fleet, WithId } from '@appjusto/types';
import firebase from 'firebase/compat/app';
import * as Sentry from 'sentry-expo';
import FirebaseRefs from '../FirebaseRefs';
import { documentAs } from '../types';

export default class FleetApi {
  constructor(private refs: FirebaseRefs) {}

  // firestore
  observeFleet(
    fleetId: string,
    resultHandler: (orders: WithId<Fleet>) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs.getFleetRef(fleetId).onSnapshot(
      (snapshot) => resultHandler(documentAs<Fleet>(snapshot)),
      (error) => {
        console.log(error);
        Sentry.Native.captureException(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  async createFleet(fleet: Partial<Fleet>) {
    const doc = this.refs.getFleetsRef().doc();
    await doc.set(fleet);
    return doc;
  }
}
