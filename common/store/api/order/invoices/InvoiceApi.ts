import { WithId } from '@appjusto/types';
import { IuguInvoiceStatus } from '@appjusto/types/payment/iugu';
import * as Sentry from 'sentry-expo';
import { Invoice } from '../../../../../../types';
import { FirestoreRefs } from '../../../refs/FirestoreRefs';
import { documentsAs } from '../../types';

interface FetchOrderInvoicesOptions {
  orderId?: string;
  consumerId?: string;
  status?: IuguInvoiceStatus;
  limit?: number;
}

export default class InvoiceApi {
  constructor(private firestoreRefs: FirestoreRefs) {}

  async observeInvoices(
    options: FetchOrderInvoicesOptions,
    resultHandler: (orders: WithId<Invoice>[]) => void
  ) {
    let query = this.firestoreRefs.getInvoicesRef().orderBy('createdOn', 'desc');
    if (options?.orderId) query = query.where('orderId', '==', options.orderId);
    if (options?.consumerId) query = query.where('consumerId', '==', options.consumerId);
    if (options?.status) query = query.where('status', '==', options.status);
    if (options?.limit) query = query.limit(options.limit);
    return query.onSnapshot(
      (querySnapshot) =>
        resultHandler(querySnapshot.empty ? [] : documentsAs<Invoice>(querySnapshot.docs)),
      (error) => {
        console.error(error);
        Sentry.Native.captureException(error);
      }
    );
  }
}
