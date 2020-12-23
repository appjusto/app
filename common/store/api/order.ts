import {
  ChatMessage,
  CreateOrderPayload,
  Fare,
  IssueType,
  Order,
  OrderIssue,
  OrderRejection,
  PlaceOrderPayload,
  Review,
  WithId,
} from 'appjusto-types';
import firebase from 'firebase';

export type ObserveOrdersOptions = {
  createdBy?: string;
  deliveredBy?: string;
};

export default class OrderApi {
  constructor(
    private firestore: firebase.firestore.Firestore,
    private functions: firebase.functions.Functions
  ) {}

  // callables
  // consumer
  async createOrder(payload: CreateOrderPayload) {
    return (await this.functions.httpsCallable('createOrder')(payload)).data;
  }

  async getOrderQuotes(orderId: string) {
    return (await this.functions.httpsCallable('getOrderQuotes')({ orderId })).data as Fare[];
  }

  async placeOrder(payload: PlaceOrderPayload) {
    const result = await this.functions.httpsCallable('placeOrder')(payload);
    return result.data;
  }

  async tipCourier(orderId: string, tip: number) {
    return (await this.functions.httpsCallable('tipCourier')({ orderId, tip })).data;
  }

  async cancelOrder(orderId: string, cancellation?: OrderIssue) {
    return (await this.functions.httpsCallable('cancelOrder')({ orderId, cancellation })).data;
  }

  async deleteOrder(orderId: string) {
    return this.firestore.collection('orders').doc(orderId).delete();
  }

  async sendOrderProblem(orderId: string, problem: OrderIssue) {
    return (await this.functions.httpsCallable('sendOrderProblem')({ orderId, problem })).data;
  }

  async sendCourierReview(orderId: string, review: Review) {
    return (await this.functions.httpsCallable('sendCourierReview')({ orderId, review })).data;
  }

  // courier
  async matchOrder(orderId: string) {
    return (await this.functions.httpsCallable('matchOrder')({ orderId })).data;
  }

  async rejectOrder(orderId: string, rejection: OrderRejection) {
    return (await this.functions.httpsCallable('rejectOrder')({ orderId, rejection })).data;
  }

  async nextDispatchingState(orderId: string) {
    return (await this.functions.httpsCallable('nextDispatchingState')({ orderId })).data;
  }

  async completeDelivery(orderId: string) {
    return (await this.functions.httpsCallable('completeDelivery')({ orderId })).data;
  }

  async sendCourierOrderProblem(orderId: string, problem: OrderIssue) {
    return (await this.functions.httpsCallable('sendCourierOrderProblem')({ orderId, problem }))
      .data;
  }

  // firestore
  // both courier & customers
  observeOrders(
    options: ObserveOrdersOptions,
    resultHandler: (orders: WithId<Order>[]) => void
  ): firebase.Unsubscribe {
    const { createdBy, deliveredBy } = options;
    let query = this.firestore
      .collection('orders')
      .orderBy('createdOn', 'desc')
      .where('status', 'in', [
        'quote',
        'confirming',
        'matching',
        'dispatching',
        'delivered',
        'unmatched',
        'canceled',
      ]);
    if (createdBy) query = query.where('consumer.id', '==', createdBy);
    if (deliveredBy) query = query.where('courier.id', '==', deliveredBy);

    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        const docs: WithId<Order>[] = [];
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
  // observe order's chat
  observeOrderChat(
    orderId: string,
    resultHandler: (orders: WithId<ChatMessage>[]) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.firestore
      .collection('orders')
      .doc(orderId)
      .collection('chat')
      .orderBy('timestamp', 'asc')
      .onSnapshot(
        (querySnapshot) => {
          const docs: WithId<ChatMessage>[] = [];
          querySnapshot.forEach((doc) => {
            docs.push({ ...(doc.data() as ChatMessage), id: doc.id });
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

  async sendMessage(orderId: string, message: Partial<ChatMessage>) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    return this.firestore
      .collection('orders')
      .doc(orderId)
      .collection('chat')
      .add({
        ...message,
        timestamp,
      });
  }

  async fetchIssues(type: IssueType) {
    return (
      await this.firestore
        .collection('platform')
        .doc('data')
        .collection('issues')
        .where('type', '==', type)
        .get()
    ).docs;
  }
}
