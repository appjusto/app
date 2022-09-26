import { Fleet, WithId } from '@appjusto/types';
import { doc, onSnapshot, setDoc, Unsubscribe } from 'firebase/firestore';
import * as Sentry from 'sentry-expo';
import { FirestoreRefs } from '../../refs/FirestoreRefs';
import { documentAs } from '../types';

export default class FleetApi {
  constructor(private firestoreRefs: FirestoreRefs) {}

  // firestore
  observeFleet(fleetId: string, resultHandler: (orders: WithId<Fleet>) => void): Unsubscribe {
    return onSnapshot(
      this.firestoreRefs.getFleetRef(fleetId),
      (snapshot) => resultHandler(documentAs<Fleet>(snapshot)),
      (error) => {
        console.log(error);
        Sentry.Native.captureException(error);
      }
    );
  }

  async createFleet(fleet: Partial<Fleet>) {
    const fleetRef = doc(this.firestoreRefs.getFleetsRef());
    await setDoc(fleetRef, fleet);
    return fleetRef;
  }
}
