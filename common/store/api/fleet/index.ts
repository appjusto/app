import { Fleet, WithId } from '@appjusto/types';
import { doc, onSnapshot, setDoc, Unsubscribe } from 'firebase/firestore';
import * as Sentry from 'sentry-expo';
import FirebaseRefs from '../FirebaseRefs';
import { documentAs } from '../types';

export default class FleetApi {
  constructor(private refs: FirebaseRefs) {}

  // firestore
  observeFleet(fleetId: string, resultHandler: (orders: WithId<Fleet>) => void): Unsubscribe {
    return onSnapshot(
      this.refs.getFleetRef(fleetId),
      (snapshot) => resultHandler(documentAs<Fleet>(snapshot)),
      (error) => {
        console.log(error);
        Sentry.Native.captureException(error);
      }
    );
  }

  async createFleet(fleet: Partial<Fleet>) {
    const fleetRef = doc(this.refs.getFleetsRef());
    await setDoc(fleetRef, fleet);
    return fleetRef;
  }
}
