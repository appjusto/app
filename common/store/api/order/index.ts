import { Dayjs } from '@appjusto/dates';
import {
  Business,
  CancelOrderPayload,
  ChatMessage,
  ConsumerProfile,
  Issue,
  LatLng,
  Order,
  OrderCancellation,
  OrderConfirmation,
  OrderIssue,
  OrderItem,
  OrderStatus,
  OrderType,
  Place,
  PlaceOrderPayloadPayment,
  WithId,
} from '@appjusto/types';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { chunk, isEmpty, uniq } from 'lodash';
import * as Sentry from 'sentry-expo';
import { OrderCourierLocationLog } from '../../../../../types';
import { getAppVersion } from '../../../utils/version';
import { FirestoreRefs } from '../../refs/FirestoreRefs';
import { FunctionsRef } from '../../refs/FunctionsRef';
import { isAvailable } from '../business/selectors';
import { fetchPublicIP } from '../externals/ipify';
import { documentAs, documentsAs } from '../types';
import InvoiceApi from './invoices/InvoiceApi';
import { ObserveOrdersOptions } from './types';

export type QueryOrdering = 'asc' | 'desc';

interface PlaceOrderOptions {
  orderId: string;
  payment: PlaceOrderPayloadPayment;
  invoiceWithCPF?: boolean;
  fleetId?: string;
  coordinates?: LatLng;
  additionalInfo?: string;
  wantToShareData?: boolean;
}

export default class OrderApi {
  private _invoices: InvoiceApi;

  constructor(private firestoreRefs: FirestoreRefs, private functionsRef: FunctionsRef) {
    this._invoices = new InvoiceApi(this.firestoreRefs);
  }

  invoice() {
    return this._invoices;
  }

  // firestore
  // consumer
  async createFoodOrder(
    business: WithId<Business>,
    consumer: WithId<ConsumerProfile>,
    items: OrderItem[] = [],
    destination: Place | null = null
  ) {
    const businessAddress = business.businessAddress!;
    const { address, number, neighborhood, city, additional, instructions } = businessAddress;
    const main = `${address}, ${number}`;
    const secondary = `${neighborhood ? `${neighborhood} - ` : ''}${city}`;
    const origin: Place = {
      address: {
        main,
        secondary,
        description: `${main} - ${secondary}`,
      },
      additionalInfo: additional ?? '',
      instructions: instructions ?? '',
    };
    const payload: Partial<Order> = {
      type: 'food',
      status: 'quote',
      fulfillment: 'delivery',
      dispatchingStatus: 'idle',
      dispatchingState: null,
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
      origin,
      destination,
      createdOn:
        FirebaseFirestoreTypes.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
      items,
    };
    const order = await this.firestoreRefs.getOrdersRef().add(payload);
    return documentAs<Order>(await order.get());
  }
  async createOrderP2P(consumer: WithId<ConsumerProfile>, origin: Place) {
    const payload: Partial<Order> = {
      type: 'p2p',
      status: 'quote',
      fulfillment: 'delivery',
      paymentMethod: 'credit_card',
      dispatchingStatus: 'idle',
      dispatchingState: null,
      consumer: {
        id: consumer.id,
        name: consumer.name ?? '',
      },
      origin,
      createdOn:
        FirebaseFirestoreTypes.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
    };
    const order = await this.firestoreRefs.getOrdersRef().add(payload);
    return documentAs<Order>(await order.get());
  }
  async updateOrder(orderId: string, changes: Partial<Order>) {
    console.log('updating order', orderId, JSON.stringify(changes));
    await this.firestoreRefs.getOrderRef(orderId).update(changes);
  }
  async deleteOrder(orderId: string) {
    await this.firestoreRefs.getOrderRef(orderId).delete();
  }

  async hasOrderedBefore(options: ObserveOrdersOptions) {
    const { consumerId, courierId } = options;
    let query = this.firestoreRefs
      .getOrdersRef()
      .where('status', '==', 'delivered' as OrderStatus)
      .limit(1);
    if (consumerId) query = query.where('consumer.id', '==', consumerId);
    if (courierId) query = query.where('courier.id', '==', courierId);
    const snapshot = await query.get();
    return snapshot.size > 0;
  }

  // courier, customers and businesses
  //
  observeOrders(options: ObserveOrdersOptions, resultHandler: (orders: WithId<Order>[]) => void) {
    const { consumerId, courierId, statuses, businessId, orderField, from, to } = options;
    let query = this.firestoreRefs.getOrdersRef().orderBy(orderField ?? 'createdOn', 'desc');

    if (!isEmpty(statuses)) query = query.where('status', 'in', statuses);
    if (consumerId) query = query.where('consumer.id', '==', consumerId);
    if (courierId) query = query.where('courier.id', '==', courierId);
    if (businessId) query = query.where('business.id', '==', businessId);
    if (from)
      query = query.where('createdOn', '>', FirebaseFirestoreTypes.Timestamp.fromDate(from));
    if (to) query = query.where('createdOn', '<', FirebaseFirestoreTypes.Timestamp.fromDate(to));
    if (options.limit) query = query.limit(options.limit);
    return query.onSnapshot(
      (querySnapshot) =>
        resultHandler(
          documentsAs<Order>(querySnapshot.docs).filter((order) => order.status !== 'expired')
        ),
      (error) => {
        console.error(error);
        Sentry.Native.captureException(error);
      }
    );
  }
  observeOrder(
    orderId: string,
    resultHandler: (order: WithId<Order>) => void,
    errorHandler?: (error: Error) => void
  ) {
    return this.firestoreRefs.getOrderRef(orderId).onSnapshot(
      (snapshot) => resultHandler(documentAs<Order>(snapshot)),
      (error) => {
        if (errorHandler) errorHandler(error);
      }
    );
  }
  observeOrderConfirmation(
    orderId: string,
    resultHandler: (confirmation: OrderConfirmation) => void
  ) {
    return this.firestoreRefs.getOrderConfirmationRef(orderId).onSnapshot(
      (snapshot) => resultHandler(snapshot.data() as OrderConfirmation),
      (error) => {
        console.log(error);
        Sentry.Native.captureException(error);
      }
    );
  }
  observeOrderChat(
    orderId: string,
    userId: string,
    resultHandler: (orders: WithId<ChatMessage>[]) => void
  ) {
    return this.firestoreRefs
      .getChatsRef()
      .where('orderId', '==', orderId)
      .orderBy('timestamp', 'asc')
      .where('participantsIds', 'array-contains', userId)
      .onSnapshot(
        (querySnapshot) => resultHandler(documentsAs<ChatMessage>(querySnapshot.docs)),
        (error) => console.log(error)
      );
  }
  observeOrderCourierLocation(
    orderId: string,
    courierId: string,
    resultHandler: (order: LatLng | null) => void
  ) {
    return this.firestoreRefs
      .getOrderLogsRef(orderId)
      .where('type', '==', 'courier-location')
      .where('courierId', '==', courierId)
      .orderBy('timestamp', 'desc')
      .limit(1)
      .onSnapshot(
        (snapshot) => {
          if (snapshot.empty) {
            resultHandler(null);
            return;
          }
          const doc = snapshot.docs[0].data() as OrderCourierLocationLog;
          resultHandler(doc.location);
        },
        (error) => console.error(error)
      );
  }
  async sendMessage(message: Partial<ChatMessage>) {
    try {
      await this.firestoreRefs.getChatsRef().add({
        ...message,
        read: false,
        timestamp:
          FirebaseFirestoreTypes.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
      } as ChatMessage);
    } catch (error) {
      console.log(JSON.stringify(error));
      Sentry.Native.captureException(error);
    }
  }

  async updateReadMessages(messageIds: string[]) {
    const batch = firestore().batch();
    messageIds.forEach((id) => {
      batch.update(this.firestoreRefs.getChatMessageRef(id), {
        read: true,
      } as Partial<ChatMessage>);
    });
    return batch.commit();
  }

  async createIssue(orderId: string, issue: OrderIssue) {
    await this.firestoreRefs.getOrderIssuesRef(orderId).add({
      ...issue,
      createdOn:
        FirebaseFirestoreTypes.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
    } as OrderIssue);
  }

  async fetchOrderCancellation(id: string) {
    return documentAs<OrderCancellation>(
      await this.firestoreRefs.getOrderCancellationRef(id).get()
    );
  }

  // business
  observeBusinessOrders(
    options: ObserveOrdersOptions,
    resultHandler: (orders: WithId<Order>[]) => void
  ) {
    const { businessId, statuses } = options;
    let query = this.firestoreRefs.getOrdersRef().orderBy('timestamps.charged', 'desc');
    if (!isEmpty(statuses)) query = query.where('status', 'in', statuses);
    if (businessId) query = query.where('business.id', '==', businessId);
    if (options.limit) query = query.limit(options.limit);
    return query.onSnapshot(
      (querySnapshot) => resultHandler(documentsAs<Order>(querySnapshot.docs)),
      (error) => {
        console.log(error);
        Sentry.Native.captureException(error);
      }
    );
  }

  observeBusinessOrdersCompletedInTheLastHour(
    resultHandler: (orders: WithId<Order>[]) => void,
    businessId?: string,
    ordering: QueryOrdering = 'desc'
  ) {
    const statuses = ['delivered', 'canceled'] as OrderStatus[];
    return this.firestoreRefs
      .getOrdersRef()
      .orderBy('updatedOn', ordering)
      .where('business.id', '==', businessId)
      .where('status', 'in', statuses)
      .where(
        'updatedOn',
        '>',
        FirebaseFirestoreTypes.Timestamp.fromDate(Dayjs().subtract(1, 'hour').toDate())
      )
      .onSnapshot(
        (querySnapshot) => resultHandler(documentsAs<Order>(querySnapshot.docs)),
        (error) => {
          console.log(error);
        }
      );
  }

  async observeBusinessActiveChatMessages(
    businessId: string,
    ordersIds: string[],
    resultHandler: (messages: WithId<ChatMessage>[]) => void
  ) {
    const unsubscribes: (() => void)[] = [];
    chunk(ordersIds, 10).forEach((ids) => {
      const query = this.firestoreRefs
        .getChatsRef()
        .where('orderId', 'in', ids)
        // .where('participantsIds', 'array-contains', businessId)
        .orderBy('timestamp', 'asc');
      unsubscribes.push(
        query.onSnapshot(
          (snapshot) => {
            if (!snapshot.empty) {
              resultHandler(documentsAs<ChatMessage>(snapshot.docs));
            }
          },
          (error) => {
            console.error(error);
          }
        )
      );
    });
    return Promise.all(unsubscribes);
  }

  // callables
  // consumer
  async getOrderQuotes(orderId: string, fleetsIds?: string[]) {
    return (
      await this.functionsRef.getGetOrderQuotesCallable()({
        orderId,
        fleetsIds,
        meta: { version: getAppVersion() },
      })
    ).data;
  }

  async placeOrder({
    orderId,
    payment,
    invoiceWithCPF,
    fleetId,
    coordinates,
    additionalInfo,
    wantToShareData,
  }: PlaceOrderOptions) {
    let ip: string | undefined;
    try {
      ip = await fetchPublicIP();
    } catch (error) {
      Sentry.Native.captureException(error);
    }
    await this.functionsRef.getPlaceOrderCallable()({
      orderId,
      payment,
      invoiceWithCPF: Boolean(invoiceWithCPF),
      fleetId,
      coordinates,
      additionalInfo,
      wantToShareData,
      meta: { version: getAppVersion(), ip },
    });
  }

  async updateOrderCallable(orderId: string, payment: PlaceOrderPayloadPayment) {
    return (
      await this.functionsRef.getUpdateOrderCallable()({
        orderId,
        payment,
        meta: { version: getAppVersion() },
      })
    ).data;
  }

  async getCancellationInfo(orderId: string) {
    return (
      await this.functionsRef.getCancellationInfoCallable()({
        orderId,
        meta: { version: getAppVersion() },
      })
    ).data;
  }

  async cancelOrder(
    orderId: string,
    acknowledgedCosts: number,
    cancellation?: WithId<Issue>,
    comment?: string
  ) {
    await this.functionsRef.getCancelOrderCallable()({
      orderId,
      acknowledgedCosts,
      cancellation,
      comment,
      meta: { version: getAppVersion() },
    });
  }

  async tipCourier(orderId: string, tip: number) {
    await this.updateOrder(orderId, { tip: { value: tip } });
  }

  async getMostRecentRestaurants(consumerId: string, max: number = 3) {
    const ordersSnapshot = await this.firestoreRefs
      .getOrdersRef()
      .orderBy('createdOn', 'desc')
      .where('type', '==', 'food' as OrderType)
      .where('status', '==', 'delivered' as OrderStatus)
      .where('consumer.id', '==', consumerId)
      .limit(max * 3) // we fetch more than we need to have some latitude to deal with repeated restaurants
      .get();

    if (ordersSnapshot.empty) return [];
    const businessIds = uniq(
      documentsAs<Order>(ordersSnapshot.docs).map((order) => order.business!.id)
    );
    const lastRestsQuerySnapshot = await this.firestoreRefs
      .getBusinessesRef()
      .where(FirebaseFirestoreTypes.FieldPath.documentId(), 'in', businessIds)
      .limit(max)
      .get();

    if (lastRestsQuerySnapshot.empty) return [];
    const businesses = documentsAs<Business>(lastRestsQuerySnapshot.docs).filter(
      (business) =>
        business.enabled &&
        business.situation === 'approved' &&
        business.status === 'available' &&
        isAvailable(business.schedules, new Date())
    );
    return businesses
      .sort((a, b) => businessIds.indexOf(a.id) - businessIds.indexOf(b.id))
      .slice(0, max);
  }
  // courier
  async matchOrder(orderId: string, distanceToOrigin: number = 0) {
    await this.functionsRef.getMatchOrderCallable()({
      orderId,
      distanceToOrigin,
      meta: { version: getAppVersion() },
    });
  }

  async rejectOrder(orderId: string, issue: WithId<Issue>, comment?: string) {
    await this.functionsRef.getRejectOrderCallable()({
      orderId,
      issue,
      comment,
      meta: { version: getAppVersion() },
    });
  }

  async dropOrder(orderId: string, issue: WithId<Issue>, comment?: string) {
    await this.functionsRef.getDropOrderCallable()({
      orderId,
      issue,
      comment,
      meta: { version: getAppVersion() },
    });
  }

  async nextDispatchingState({ id, type, status, dispatchingState }: WithId<Order>) {
    let update: Partial<Order> | null = null;
    if (dispatchingState === 'going-pickup') {
      update = { dispatchingState: 'arrived-pickup' };
    } else if (dispatchingState === 'arrived-pickup') {
      if (type === 'p2p' || status === 'dispatching') {
        update = {
          dispatchingState: 'going-destination',
        };
      }
    } else if (dispatchingState === 'going-destination') {
      update = { dispatchingState: 'arrived-destination' };
    }
    if (update) await this.updateOrder(id, update);
    else {
      throw new Error('Não foi possível determinar o próximo estado de entrega.');
    }
    // await this.refs.getNextDispatchingStateCallable()({
    //   orderId: id,
    //   meta: { version: getAppVersion() },
    // });
  }

  async completeDelivery(
    orderId: string,
    handshakeResponse?: string,
    deliveredTo?: string,
    comment?: string
  ) {
    await this.functionsRef.getCompleteDeliveryCallable()({
      orderId,
      handshakeResponse,
      deliveredTo,
      comment,
      meta: { version: getAppVersion() },
    });
  }

  // business
  async cancelBusinessOrder(data: CancelOrderPayload) {
    const { params } = data;
    const paramsData = params ?? { refund: ['products', 'delivery', 'platform'] };
    const payload: CancelOrderPayload = {
      ...data,
      meta: { version: getAppVersion() },
      params: paramsData,
    };
    return await this.functionsRef.getCancelOrderCallable()(payload);
  }
}
