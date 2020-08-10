import firebase from 'firebase';

import { SaveCardPayload } from '../consumer/types';

export default class ConsumerApi {
  constructor(
    private firestore: firebase.firestore.Firestore,
    private functions: firebase.functions.Functions
  ) {}

  async saveCard(card: SaveCardPayload) {
    return (await this.functions.httpsCallable('saveCard')({ card })).data;
  }
}
