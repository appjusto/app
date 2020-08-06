import firebase from 'firebase';

import { Consumer } from '../consumer/types';

export default class ConsumerApi {
  constructor(private firestore: firebase.firestore.Firestore) {}

  private getConsumerRef(consumerId: string) {
    return this.firestore.collection('consumers').doc(consumerId);
  }

  // create consumer profile
  createConsumer(consumerId: string) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    return this.getConsumerRef(consumerId).set({
      timestamp,
    });
  }

  // observe consumer profile changes
  observeConsumer(
    consumerId: string,
    resultHandler: (consumer: Consumer) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.getConsumerRef(consumerId).onSnapshot(
      async (doc) => {
        // ensure courier exists
        if (!doc.exists) await this.createConsumer(consumerId);
        else resultHandler({ ...doc.data(), id: consumerId });
      },
      (error) => {
        console.error(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  // update consumer
  updateConsumer(consumerId: string, changes: object) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    return this.getConsumerRef(consumerId).set(
      {
        ...changes,
        timestamp,
      },
      { merge: true }
    );
  }
}
