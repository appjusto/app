import { Order, Place } from '../order/types';

export default class OrderApi {
  constructor(
    private firestore: firebase.firestore.Firestore,
    private functions: firebase.functions.Functions
  ) {}

  // observe orders
  observeOrdersCreatedBy(
    consumerId: string,
    resultHandler: (orders: Order[]) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.firestore
      .collection('orders')
      .where('consumerId', '==', consumerId)
      .where('status', 'in', ['quote', 'matching', 'dispatching', 'delivered', 'canceled'])
      .orderBy('createdOn', 'desc')
      .onSnapshot(
        (querySnapshot) => {
          const docs: Order[] = [];
          querySnapshot.forEach((doc) => {
            docs.push({ ...(doc.data() as Order), id: doc.id });
          });
          resultHandler(docs);
        },
        (error) => {
          console.error(error);
        }
      );
    // returns the unsubscribe function
    return unsubscribe;
  }

  // observe orders
  observeOrdersDeliveredBy(
    courierId: string,
    resultHandler: (orders: Order[]) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.firestore
      .collection('orders')
      .where('courierId', '==', courierId)
      .where('status', 'in', ['dispatching', 'delivered', 'canceled'])
      .onSnapshot(
        (querySnapshot) => {
          const docs: Order[] = [];
          querySnapshot.forEach((doc) => {
            docs.push({ ...(doc.data() as Order), id: doc.id });
          });
          resultHandler(docs);
        },
        (error) => {
          console.error(error);
        }
      );
    // returns the unsubscribe function
    return unsubscribe;
  }

  // functions
  // submit profile
  async createOrder(origin: Place, destination: Place) {
    return (await this.functions.httpsCallable('createOrder')({ origin, destination })).data;
  }

  async confirmOrder(orderId: string, cardId: string) {
    return (await this.functions.httpsCallable('confirmOrder')({ orderId, cardId })).data;
  }

  async cancelOrder(orderId: string) {
    return (await this.functions.httpsCallable('cancelOrder')({ orderId })).data;
  }

  async matchOrder(orderId: string) {
    return (await this.functions.httpsCallable('matchOrder')({ orderId })).data;
  }
}
