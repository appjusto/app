import { Place } from '../types';

export default class OrderApi {
  constructor(private functions: firebase.functions.Functions) {}

  // functions
  // submit profile
  async createOrder(origin: Place, destination: Place) {
    return (await this.functions.httpsCallable('createOrder')({ origin, destination })).data;
  }

  async confirmOrder(orderId: string, cardId: string) {
    return (await this.functions.httpsCallable('confirmOrder')({ orderId, cardId })).data;
  }

  async matchOrder(orderId: string) {
    return (await this.functions.httpsCallable('matchOrder')({ orderId })).data;
  }
}
