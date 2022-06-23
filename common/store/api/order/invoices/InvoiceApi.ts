import { FirestoreRefs } from '@appjusto/firebase-refs';
import { InvoiceType } from '@appjusto/types';
import { IuguInvoiceStatus } from '@appjusto/types/payment/iugu';
import { getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { Invoice } from '../../../../../../types';
import { documentsAs } from '../../types';

interface FetchOrderInvoicesOptions {
  orderId?: string;
  type?: InvoiceType;
  status?: IuguInvoiceStatus;
  limit?: number;
}

export default class InvoiceApi {
  constructor(private firestoreRefs: FirestoreRefs) {}

  async fetchInvoices(options: FetchOrderInvoicesOptions) {
    const constraints = [orderBy('createdOn', 'desc')];
    if (options?.orderId) constraints.push(where('orderId', '==', options.orderId));
    if (options?.type) constraints.push(where('type', '==', options.type));
    if (options?.status) constraints.push(where('status', '==', options.status));
    if (options?.limit) constraints.push(limit(options.limit));
    const snapshot = await getDocs(query(this.firestoreRefs.getInvoicesRef(), ...constraints));
    if (snapshot.empty) return [];
    return documentsAs<Invoice>(snapshot.docs);
  }
}
