import { FirestoreRefs } from '@appjusto/firebase-refs';
import { InvoiceType, WithId } from '@appjusto/types';
import { IuguInvoiceStatus } from '@appjusto/types/payment/iugu';
import {
  collection,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import * as Sentry from 'sentry-expo';
import { Invoice } from '../../../../../../types';
import { documentsAs } from '../../types';

interface FetchOrderInvoicesOptions {
  orderId?: string;
  invoiceType?: InvoiceType;
  status?: IuguInvoiceStatus;
  limit?: number;
}

export default class InvoiceApi {
  constructor(private firestoreRefs: FirestoreRefs) {}

  async observeInvoices(
    options: FetchOrderInvoicesOptions,
    resultHandler: (orders: WithId<Invoice>[]) => void
  ) {
    const constraints = [orderBy('createdOn', 'desc')];
    if (options?.orderId) constraints.push(where('orderId', '==', options.orderId));
    if (options?.invoiceType) constraints.push(where('invoiceType', '==', options.invoiceType));
    if (options?.status) constraints.push(where('status', '==', options.status));
    if (options?.limit) constraints.push(limit(options.limit));
    return onSnapshot(
      // query(this.firestoreRefs.getInvoicesRef(), ...constraints),
      query(collection(getFirestore(), 'invoices'), ...constraints),
      (querySnapshot) =>
        resultHandler(querySnapshot.empty ? [] : documentsAs<Invoice>(querySnapshot.docs)),
      (error) => {
        console.error(error);
        Sentry.Native.captureException(error);
      }
    );
  }
}
