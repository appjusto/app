import { FirestoreRefs, FunctionsRef } from '@appjusto/firebase-refs';
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
import {
  addDoc,
  deleteDoc,
  documentId,
  Firestore,
  FirestoreError,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  Unsubscribe,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { isEmpty, uniq } from 'lodash';
import * as Sentry from 'sentry-expo';
import { OrderCourierLocationLog } from '../../../../../types';
import { getAppVersion } from '../../../utils/version';
import { fetchPublicIP } from '../externals/ipify';
import { documentAs, documentsAs } from '../types';
import InvoiceApi from './invoices/InvoiceApi';
import { ObserveOrdersOptions } from './types';

export type QueryOrdering = 'asc' | 'desc';

export default class OrderApi {
  private _invoices: InvoiceApi;

  constructor(
    private firestoreRefs: FirestoreRefs,
    private functionsRef: FunctionsRef,
    private firestore: Firestore
  ) {
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
    const { address, number, neighborhood, city, additional } = businessAddress;
    const main = `${address}, ${number}`;
    const secondary = `${neighborhood ? `${neighborhood} - ` : ''}${city}`;
    const origin: Place = {
      address: {
        main,
        secondary,
        description: `${main} - ${secondary}`,
      },
      additionalInfo: additional ?? '',
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
      createdOn: serverTimestamp(),
      items,
    };
    const order = await addDoc(this.firestoreRefs.getOrdersRef(), payload);
    return documentAs<Order>(await getDoc(order));
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
      createdOn: serverTimestamp(),
    };
    const order = await addDoc(this.firestoreRefs.getOrdersRef(), payload);
    return documentAs<Order>(await getDoc(order));
  }
  async updateOrder(orderId: string, changes: Partial<Order>) {
    await updateDoc(this.firestoreRefs.getOrderRef(orderId), changes);
  }
  async deleteOrder(orderId: string) {
    await deleteDoc(this.firestoreRefs.getOrderRef(orderId));
  }

  async hasOrderedBefore(options: ObserveOrdersOptions) {
    const { consumerId, courierId } = options;
    const constraints = [where('status', '==', 'delivered' as OrderStatus), limit(1)];
    if (consumerId) constraints.push(where('consumer.id', '==', consumerId));
    if (courierId) constraints.push(where('courier.id', '==', courierId));
    const snapshot = await getDocs(query(this.firestoreRefs.getOrdersRef(), ...constraints));
    return snapshot.size > 0;
  }

  // courier, customers and businesses
  //
  observeOrders(
    options: ObserveOrdersOptions,
    resultHandler: (orders: WithId<Order>[]) => void
  ): Unsubscribe {
    const { consumerId, courierId, statuses, businessId, orderField, from, to } = options;
    const constraints = [orderBy(orderField ?? 'createdOn', 'desc')];
    if (!isEmpty(statuses)) constraints.push(where('status', 'in', statuses));
    if (consumerId) constraints.push(where('consumer.id', '==', consumerId));
    if (courierId) constraints.push(where('courier.id', '==', courierId));
    if (businessId) constraints.push(where('business.id', '==', businessId));
    if (from) constraints.push(where('createdOn', '>', Timestamp.fromDate(from)));
    if (to) constraints.push(where('createdOn', '<', Timestamp.fromDate(to)));
    if (options.limit) constraints.push(limit(options.limit));
    return onSnapshot(
      query(this.firestoreRefs.getOrdersRef(), ...constraints),
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
    errorHandler: (error: FirestoreError) => void
  ): Unsubscribe {
    return onSnapshot(
      this.firestoreRefs.getOrderRef(orderId),
      (snapshot) => resultHandler(documentAs<Order>(snapshot)),
      (error) => errorHandler(error)
    );
  }
  observeOrderConfirmation(
    orderId: string,
    resultHandler: (confirmation: OrderConfirmation) => void
  ): Unsubscribe {
    return onSnapshot(
      this.firestoreRefs.getOrderConfirmationRef(orderId),
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
  ): Unsubscribe {
    const constraints = [where('orderId', '==', orderId), orderBy('timestamp', 'asc')];
    constraints.push(where('participantsIds', 'array-contains', userId));
    return onSnapshot(
      query(this.firestoreRefs.getChatsRef(), ...constraints),
      (querySnapshot) => resultHandler(documentsAs<ChatMessage>(querySnapshot.docs)),
      (error) => console.log(error)
    );
  }
  observeOrderCourierLocation(
    orderId: string,
    courierId: string,
    resultHandler: (order: LatLng | null) => void
  ): Unsubscribe {
    console.log('### observeOrderCourierLocation ###');
    return onSnapshot(
      query(
        this.firestoreRefs.getOrderLogsRef(orderId),
        where('type', '==', 'courier-location'),
        where('courierId', '==', courierId),
        orderBy('timestamp', 'desc'),
        limit(1)
      ),
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
    return addDoc(this.firestoreRefs.getChatsRef(), {
      ...message,
      read: false,
      timestamp: serverTimestamp(),
    } as ChatMessage);
  }

  async updateReadMessages(messageIds: string[]) {
    const batch = writeBatch(this.firestore);
    messageIds.forEach((id) => {
      batch.update(this.firestoreRefs.getChatMessageRef(id), {
        read: true,
      } as Partial<ChatMessage>);
    });
    return batch.commit();
  }

  async createIssue(orderId: string, issue: OrderIssue) {
    await addDoc(this.firestoreRefs.getOrderIssuesRef(orderId), {
      ...issue,
      createdOn: serverTimestamp(),
    } as OrderIssue);
  }

  async fetchOrderCancellation(id: string) {
    return documentAs<OrderCancellation>(
      await getDoc(this.firestoreRefs.getOrderCancellationRef(id))
    );
  }

  // business
  observeBusinessOrders(
    options: ObserveOrdersOptions,
    resultHandler: (orders: WithId<Order>[]) => void
  ): Unsubscribe {
    const { businessId, statuses } = options;
    const constraints = [orderBy('timestamps.charged', 'desc')];
    if (!isEmpty(statuses)) constraints.push(where('status', 'in', statuses));
    if (businessId) constraints.push(where('business.id', '==', businessId));
    if (options.limit) constraints.push(limit(options.limit));
    return onSnapshot(
      query(this.firestoreRefs.getOrdersRef(), ...constraints),
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
  ): Unsubscribe {
    const statuses = ['delivered', 'canceled'] as OrderStatus[];
    const baseTim = new Date();
    baseTim.setHours(baseTim.getHours() - 1);
    return onSnapshot(
      query(
        this.firestoreRefs.getOrdersRef(),
        orderBy('updatedOn', ordering),
        where('business.id', '==', businessId),
        where('status', 'in', statuses),
        where('updatedOn', '>', baseTim)
      ),
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
    const IdsLimit = 10;
    const unsubscribes: Unsubscribe[] = [];
    for (var i = 0; i < ordersIds.length; i = i + IdsLimit) {
      const ids = ordersIds.slice(i, i + IdsLimit);
      const q = query(
        this.firestoreRefs.getChatsRef(),
        where('orderId', 'in', ids),
        where('participantsIds', 'array-contains', businessId),
        orderBy('timestamp', 'asc')
      );
      unsubscribes.push(
        onSnapshot(
          q,
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
    }
    return Promise.all(unsubscribes).then((content) => content.flat());
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

  async placeOrder(
    orderId: string,
    fleetId: string,
    payment: PlaceOrderPayloadPayment,
    invoiceWithCPF: boolean,
    coordinates?: LatLng,
    additionalInfo?: string,
    wantToShareData?: boolean
  ) {
    let ip: string | undefined;
    try {
      ip = await fetchPublicIP();
    } catch (error) {
      Sentry.Native.captureException(error);
    }
    await this.functionsRef.getPlaceOrderCallable()({
      orderId,
      fleetId,
      payment,
      invoiceWithCPF,
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
    await this.functionsRef.getTipCourierCallable()({
      orderId,
      tip,
      meta: { version: getAppVersion() },
    });
  }

  async getMostRecentRestaurants(consumerId: string, max: number = 3) {
    const ordersSnapshot = await getDocs(
      query(
        this.firestoreRefs.getOrdersRef(),
        orderBy('createdOn', 'desc'),
        where('type', '==', 'food' as OrderType),
        where('status', '==', 'delivered' as OrderStatus),
        where('consumer.id', '==', consumerId),
        limit(max * 3)
      )
    ); // we fetch more than we need to have some latitude for consumers whose order to the same restaurant
    if (ordersSnapshot.empty) return [];
    const businessIds = uniq(
      documentsAs<Order>(ordersSnapshot.docs).map((order) => order.business!.id)
    );
    const lastRestsQuerySnapshot = await getDocs(
      query(
        this.firestoreRefs.getBusinessesRef(),
        where(documentId(), 'in', businessIds),
        where('status', '==', 'open'),
        limit(max)
      )
    );
    if (lastRestsQuerySnapshot.empty) return [];
    const businesses = documentsAs<Business>(lastRestsQuerySnapshot.docs);
    return businessIds
      .slice(0, max)
      .map((id) => businesses.find((b) => b.id === id)!)
      .filter((b) => !!b);
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
