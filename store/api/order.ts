import { Place } from '../types';

export default class OrderApi {
  constructor(private functions: firebase.functions.Functions) {}

  // functions
  // submit profile
  async createOrder(origin: Place, destination: Place) {
    return this.functions.httpsCallable('createOrder')({ origin, destination });
  }

  async confirmOrder(orderId: string, cardId: string) {
    return this.functions.httpsCallable('confirmOrder')({ orderId, cardId });
  }

  async matchOrder(orderId: string) {
    return this.functions.httpsCallable('matchOrder')({ orderId });
  }
}
