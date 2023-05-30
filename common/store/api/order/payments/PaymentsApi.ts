import { Payment, WithId } from '@appjusto/types';
import { IuguInvoiceStatus } from '@appjusto/types/payment/iugu';
import {
  QueryConstraint,
  collection,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import * as Sentry from 'sentry-expo';
import { FirestoreRefs } from '../../../refs/FirestoreRefs';
import { documentsAs } from '../../types';

interface FetchOrderPaymentsOptions {
  orderId?: string;
  consumerId?: string;
  status?: IuguInvoiceStatus;
  limit?: number;
}

export default class PaymentsApi {
  constructor(private firestoreRefs: FirestoreRefs) {}

  async observePayments(
    options: FetchOrderPaymentsOptions,
    resultHandler: (orders: WithId<Payment>[]) => void
  ) {
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
    if (options?.orderId) constraints.push(where('order.id', '==', options.orderId));
    if (options?.consumerId) constraints.push(where('from.accountId', '==', options.consumerId));
    if (options?.status) constraints.push(where('status', '==', options.status));
    if (options?.limit) constraints.push(limit(options.limit));
    return onSnapshot(
      // query(this.firestoreRefs.getInvoicesRef(), ...constraints),
      query(collection(getFirestore(), 'payments'), ...constraints),
      (querySnapshot) =>
        resultHandler(querySnapshot.empty ? [] : documentsAs<Payment>(querySnapshot.docs)),
      (error) => {
        console.error(error);
        Sentry.Native.captureException(error);
      }
    );
  }
}
