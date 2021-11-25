import {
  Business,
  CancelOrderPayload,
  ChatMessage,
  CompleteDeliveryPayload,
  ConsumerProfile,
  DropOrderPayload,
  Fare,
  GetCancellationInfoPayload,
  GetCancellationInfoResult,
  GetOrderQuotesPayload,
  Issue,
  LatLng,
  MatchOrderPayload,
  NextDispatchingStatePayload,
  Order,
  OrderCancellation,
  OrderConfirmation,
  OrderIssue,
  OrderItem,
  OrderStatus,
  OrderType,
  Place,
  PlaceOrderPayload,
  PlaceOrderPayloadPayment,
  RejectOrderPayload,
  TipCourierPayload,
  UpdateOrderPayload,
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
  constructor(private refs: FirebaseRefs, private firestore: firebase.firestore.Firestore) {}

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
      dispatchingStatus: 'idle',
      business: {
        id: business.id,
        name: business.name!,
        cusine: business.cuisine!,
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
      dispatchingStatus: 'idle',
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
    resultHandler: (order: WithId<Order>) => void,
    errorHandler: (error: firebase.firestore.FirestoreError) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs.getOrderRef(orderId).onSnapshot(
      (snapshot) => resultHandler(documentAs<Order>(snapshot)),
      (error) => errorHandler(error)
    );
    // returns the unsubscribe function
    return unsubscribe;
  }
  observeOrderConfirmation(
    orderId: string,
    resultHandler: (confirmation: OrderConfirmation) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs.getOrderConfirmationRef(orderId).onSnapshot(
      (snapshot) => resultHandler(snapshot.data() as OrderConfirmation),
      (error) => {
        console.log(error);
        Sentry.Native.captureException(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }
  observeOrderChat(
    orderId: string,
    fromId: string | undefined,
    toId: string | undefined,
    resultHandler: (orders: WithId<ChatMessage>[]) => void
  ): firebase.Unsubscribe {
    const chatRef = this.refs.getOrderChatRef(orderId);
    let query = chatRef.orderBy('timestamp', 'asc');
    if (fromId) query = query.where('from.id', '==', fromId);
    if (toId) query = query.where('to.id', '==', toId);
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => resultHandler(documentsAs<ChatMessage>(querySnapshot.docs)),
      (error) => console.log(error)
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

  async updateReadMessages(orderId: string, messageIds: string[]) {
    const batch = this.firestore.batch();
    messageIds.forEach((id) => {
      batch.update(this.refs.getOrderChatMessageRef(orderId, id), {
        read: true,
      } as Partial<ChatMessage>);
    });
    return batch.commit();
  }

  async createIssue(orderId: string, issue: OrderIssue) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    await this.refs
      .getOrderIssuesRef(orderId)
      .add({ ...issue, createdOn: timestamp } as OrderIssue);
  }

  async fetchOrderCancellation(id: string) {
    const doc = this.refs.getOrderCancellationRef(id);
    return documentAs<OrderCancellation>(await doc.get());
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
    payment: PlaceOrderPayloadPayment,
    invoiceWithCPF: boolean,
    coordinates?: LatLng,
    additionalInfo?: string,
    wantToShareData?: boolean
  ) {
    const payload: PlaceOrderPayload = {
      orderId,
      fleetId,
      payment,
      invoiceWithCPF,
      coordinates,
      additionalInfo,
      wantToShareData,
      meta: { version: Constants.nativeBuildVersion },
    };
    return (await this.refs.getPlaceOrderCallable()(payload)).data;
  }

  async updateOrderCallable(orderId: string, payment: PlaceOrderPayloadPayment) {
    const payload: UpdateOrderPayload = {
      orderId,
      payment,
      meta: { version: Constants.nativeBuildVersion },
    };
    return (await this.refs.getUpdateOrderCallable()(payload)).data;
  }

  async getCancellationInfo(orderId: string) {
    const payload: GetCancellationInfoPayload = {
      orderId,
      meta: { version: Constants.nativeBuildVersion },
    };
    return (await this.refs.getCancellationInfoCallable()(payload))
      .data as GetCancellationInfoResult;
  }

  async cancelOrder(
    orderId: string,
    acknowledgedCosts: number,
    cancellation?: WithId<Issue>,
    comment?: string
  ) {
    const payload: CancelOrderPayload = {
      orderId,
      acknowledgedCosts,
      cancellation,
      comment,
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

  async getMostRecentRestaurants(consumerId: string, limit: number = 3) {
    const ordersSnapshot = await this.refs
      .getOrdersRef()
      .orderBy('createdOn', 'desc')
      .where('type', '==', 'food' as OrderType)
      .where('status', '==', 'delivered' as OrderStatus)
      .where('consumer.id', '==', consumerId)
      .limit(limit * 3) // we fetch more than we need to have some latitude for consumers whose order to the same restaurant
      .get();
    const businessIds = documentsAs<Order>(ordersSnapshot.docs).map((order) => order.business!.id);
    const lastRestsQuerySnapshot = await this.refs
      .getBusinessesRef()
      .where(firebase.firestore.FieldPath.documentId(), 'in', businessIds)
      .where('status', '==', 'open')
      .limit(limit)
      .get();
    return documentsAs<WithId<Business>>(lastRestsQuerySnapshot.docs);
  }
  // courier
  async matchOrder(orderId: string) {
    const payload: MatchOrderPayload = {
      orderId,
      meta: { version: Constants.nativeBuildVersion },
    };
    return (await this.refs.getMatchOrderCallable()(payload)).data;
  }

  async rejectOrder(orderId: string, issue: WithId<Issue>, comment?: string) {
    const payload: RejectOrderPayload = {
      orderId,
      issue,
      comment,
      meta: { version: Constants.nativeBuildVersion },
    };
    return (await this.refs.getRejectOrderCallable()(payload)).data;
  }

  async dropOrder(orderId: string, issue: WithId<Issue>, comment?: string) {
    const payload: DropOrderPayload = {
      orderId,
      issue,
      comment,
      meta: { version: Constants.nativeBuildVersion },
    };
    return (await this.refs.getDropOrderCallable()(payload)).data;
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
