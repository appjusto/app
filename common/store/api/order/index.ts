import {
  Business,
  CancelOrderPayload,
  ChatMessage,
  CompleteDeliveryPayload,
  ConsumerProfile,
  Fare,
  GetOrderQuotesPayload,
  MatchOrderPayload,
  NextDispatchingStatePayload,
  Order,
  OrderIssue,
  OrderItem,
  OrderRejection,
  Place,
  PlaceOrderPayload,
  PlaceOrderPaymentDetails,
  RejectOrderPayload,
  TipCourierPayload,
  WithId,
} from '@appjusto/types';
import Constants from 'expo-constants';
import firebase from 'firebase';
import { isEmpty } from 'lodash';
import * as Sentry from 'sentry-expo';
import FirebaseRefs from '../FirebaseRefs';
import { documentAs, documentsAs } from '../types';
import { ObserveOrdersOptions } from './types';

export default class OrderApi {
  constructor(private refs: FirebaseRefs) {}

  // firestore
  // consumer
  async createFoodOrder(
    business: WithId<Business>,
    consumer: WithId<ConsumerProfile>,
    items: OrderItem[] = [],
    destination: Place | null = null
  ) {
    const payload: Order = {
      type: 'food',
      status: 'quote',
      business: {
        id: business.id,
        name: business.name,
      },
      consumer: {
        id: consumer.id,
        name: consumer.name ?? '',
        notificationToken: consumer.notificationToken ?? null,
      },
      origin: {
        address: {
          main: `${business.businessAddress!.address}, ${business.businessAddress!.number}`,
          secondary: `${business.businessAddress!.city}`,
          description: `${business.businessAddress!.address}, ${
            business.businessAddress!.number
          } - ${business.businessAddress!.city}`,
        },
      },
      destination,
      createdOn: firebase.firestore.FieldValue.serverTimestamp(),
      items,
    };
    const order = await this.refs.getOrdersRef().add(payload);
    return documentAs<Order>(await order.get());
  }
  async createOrderP2P(consumer: WithId<ConsumerProfile>, origin: Place) {
    const payload: Order = {
      type: 'p2p',
      status: 'quote',
      consumer: {
        id: consumer.id,
        name: consumer.name ?? '',
      },
      origin,
      createdOn: firebase.firestore.FieldValue.serverTimestamp(),
    };
    const order = await this.refs.getOrdersRef().add(payload);
    return documentAs<Order>(await order.get());
  }
  async updateOrder(orderId: string, changes: Partial<Order>) {
    await this.refs.getOrderRef(orderId).update(changes);
  }
  async deleteOrder(orderId: string) {
    return this.refs.getOrderRef(orderId).delete();
  }

  // both courier & customers
  observeOrders(
    options: ObserveOrdersOptions,
    resultHandler: (orders: WithId<Order>[]) => void
  ): firebase.Unsubscribe {
    const { consumerId, courierId, statuses, limit, businessId } = options;
    let query = this.refs.getOrdersRef().orderBy('createdOn', 'desc');

    if (!isEmpty(statuses)) query = query.where('status', 'in', statuses);
    if (consumerId) query = query.where('consumer.id', '==', consumerId);
    if (courierId) query = query.where('courier.id', '==', courierId);
    if (limit) query = query.limit(limit);
    if (businessId) query = query.where('business.id', '==', businessId);
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => resultHandler(documentsAs<Order>(querySnapshot.docs)),
      (error) => {
        console.log(error);
        Sentry.Native.captureException(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }
  observeOrder(
    orderId: string,
    resultHandler: (orders: WithId<Order>) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs.getOrderRef(orderId).onSnapshot(
      (snapshot) => resultHandler(documentAs<Order>(snapshot)),
      (error) => {
        console.log(error);
        Sentry.Native.captureException(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }
  // observe order's chat
  // observeOrderChat(
  //   orderId: string,
  //   resultHandler: (orders: WithId<ChatMessage>[]) => void
  // ): firebase.Unsubscribe {
  //   const unsubscribe = this.refs
  //     .getOrderChatRef(orderId)
  //     .orderBy('timestamp', 'asc')
  //     .onSnapshot(
  //       (querySnapshot) => resultHandler(documentsAs<ChatMessage>(querySnapshot.docs)),
  //       (error) => {
  //         console.log(error);
  //         Sentry.Native.captureException(error);
  //       }
  //     );
  //   // returns the unsubscribe function
  //   return unsubscribe;
  // }
  observeOrderChat(
    orderId: string,
    userId: string,
    counterpartId: string,
    resultHandler: (orders: WithId<ChatMessage>[]) => void
  ): firebase.Unsubscribe {
    console.log('observeOrderChat', orderId, userId, counterpartId);
    const unsubscribe = this.refs
      .getOrderChatRef(orderId)
      .where('from.id', '==', userId)
      .where('to.id', '==', counterpartId)
      .orderBy('timestamp', 'asc')
      .onSnapshot(
        (querySnapshot) => resultHandler(documentsAs<ChatMessage>(querySnapshot.docs)),
        (error) => console.error(error)
      );
    // returns the unsubscribe function
    return unsubscribe;
  }

  async sendMessage(orderId: string, message: Partial<ChatMessage>) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    return this.refs.getOrderChatRef(orderId).add({
      ...message,
      timestamp,
    });
  }

  async createIssue(orderId: string, issue: OrderIssue) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    await this.refs
      .getOrderIssuesRef(orderId)
      .add({ ...issue, createdOn: timestamp } as OrderIssue);
  }

  // callables
  // consumer
  async getOrderQuotes(orderId: string) {
    const payload: GetOrderQuotesPayload = {
      orderId,
      meta: { version: Constants.nativeBuildVersion },
    };
    return (await this.refs.getGetOrderQuotesCallable()(payload)).data as Fare[];
  }

  async placeOrder(
    orderId: string,
    fleetId: string,
    details: PlaceOrderPaymentDetails,
    invoiceWithCpf: boolean,
    additionalInfo?: string
  ) {
    const payload: PlaceOrderPayload = {
      orderId,
      fleetId,
      ...details,
      invoiceWithCpf,
      additionalInfo,
      meta: { version: Constants.nativeBuildVersion },
    };
    return (await this.refs.getPlaceOrderCallable()(payload)).data;
  }

  async cancelOrder(orderId: string, cancellation?: OrderIssue) {
    const payload: CancelOrderPayload = {
      orderId,
      cancellation,
      meta: { version: Constants.nativeBuildVersion },
    };
    return (await this.refs.getCancelOrderCallable()(payload)).data;
  }

  async tipCourier(orderId: string, tip: number) {
    const payload: TipCourierPayload = {
      orderId,
      tip,
      meta: { version: Constants.nativeBuildVersion },
    };
    return (await this.refs.getTipCourierCallable()(payload)).data;
  }

  // courier
  async matchOrder(orderId: string) {
    const payload: MatchOrderPayload = {
      orderId,
      meta: { version: Constants.nativeBuildVersion },
    };
    return (await this.refs.getMatchOrderCallable()(payload)).data;
  }

  async rejectOrder(orderId: string, rejection: OrderRejection) {
    const payload: RejectOrderPayload = {
      orderId,
      rejection,
      meta: { version: Constants.nativeBuildVersion },
    };
    return (await this.refs.getRejectOrderCallable()(payload)).data;
  }

  async nextDispatchingState(orderId: string) {
    const payload: NextDispatchingStatePayload = {
      orderId,
      meta: { version: Constants.nativeBuildVersion },
    };
    return (await this.refs.getNextDispatchingStateCallable()(payload)).data;
  }

  async completeDelivery(
    orderId: string,
    handshakeResponse?: string,
    deliveredTo?: string,
    comment?: string
  ) {
    const payload: CompleteDeliveryPayload = {
      orderId,
      handshakeResponse,
      deliveredTo,
      comment,
      meta: { version: Constants.nativeBuildVersion },
    };
    return (await this.refs.getCompleteDeliveryCallable()(payload)).data;
  }
}
