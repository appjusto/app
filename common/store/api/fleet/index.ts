import { Fleet, WithId } from '@appjusto/types';
import * as Sentry from 'sentry-expo';
import { FirestoreRefs } from '../../refs/FirestoreRefs';
import { documentAs } from '../types';

export default class FleetApi {
  constructor(private firestoreRefs: FirestoreRefs) {}

  // firestore
  observeFleet(fleetId: string, resultHandler: (orders: WithId<Fleet>) => void) {
    return this.firestoreRefs.getFleetRef(fleetId).onSnapshot(
      (snapshot) => resultHandler(documentAs<Fleet>(snapshot)),
      (error) => {
        console.log(error);
        Sentry.Native.captureException(error);
      }
    );
  }

  async createFleet(fleet: Partial<Fleet>) {
    const ref = this.firestoreRefs.getFleetsRef().doc();
    await ref.set(fleet);
    return ref;
  }
}
