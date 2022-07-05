import { FirestoreRefs, FunctionsRef, StoragePaths } from '@appjusto/firebase-refs';
import {
  AdvanceReceivablesPayload,
  CourierOrderRequest,
  Invoice,
  InvoiceType,
  WithId,
} from '@appjusto/types';
import {
  IuguInvoiceStatus,
  IuguMarketplaceAccountAdvanceSimulation,
} from '@appjusto/types/payment/iugu';
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  Unsubscribe,
  updateDoc,
  where,
} from 'firebase/firestore';
import * as Sentry from 'sentry-expo';
import { getAppVersion } from '../../../utils/version';
import FilesApi from '../files';
import { documentAs, documentsAs } from '../types';

interface FetchCourierInvoicesOptions {
  courierId?: string;
  status?: IuguInvoiceStatus;
  start?: Date;
  end?: Date;
  limit?: number;
}

export default class CourierApi {
  constructor(
    private firestoreRefs: FirestoreRefs,
    private functionsRef: FunctionsRef,
    private storagePaths: StoragePaths,
    private files: FilesApi,
    private emulated: boolean
  ) {}

  // firestore
  observePendingOrderRequests(
    courierId: string,
    resultHandler: (orders: CourierOrderRequest[]) => void
  ): Unsubscribe {
    return onSnapshot(
      query(
        this.firestoreRefs.getCourierRequestsRef(courierId),
        where('situation', 'in', ['pending', 'viewed']),
        orderBy('createdOn', 'desc')
      ),
      (querySnapshot) => resultHandler(documentsAs<CourierOrderRequest>(querySnapshot.docs)),
      (error) => {
        console.log(error);
        Sentry.Native.captureException(error);
      }
    );
  }
  observeOrderRequest(
    courierId: string,
    orderId: string,
    resultHandler: (order: CourierOrderRequest) => void
  ): Unsubscribe {
    return onSnapshot(
      this.firestoreRefs.getCourierOrderRequestsRef(courierId, orderId),
      (snapshot) => resultHandler(documentAs<CourierOrderRequest>(snapshot)),
      (error) => {
        console.log(error);
        Sentry.Native.captureException(error);
      }
    );
  }
  viewOrderRequest(courierId: string, orderId: string) {
    return updateDoc(this.firestoreRefs.getCourierOrderRequestsRef(courierId, orderId), {
      situation: 'viewed',
    } as Partial<CourierOrderRequest>);
  }

  observeCourierInvoices(
    options: FetchCourierInvoicesOptions,
    resultHandler: (invoices: WithId<Invoice>[]) => void
  ) {
    const types = ['delivery', 'tip'] as InvoiceType[];
    const constraints = [orderBy('createdOn', 'desc')];
    if (options?.courierId) constraints.push(where('accountId', '==', options.courierId));
    if (options?.status) constraints.push(where('status', '==', options.status));
    if (options?.start) constraints.push(where('createdOn', '>=', options.start));
    if (options?.end) constraints.push(where('createdOn', '<=', options.end));
    if (options?.limit) constraints.push(limit(options.limit));
    constraints.push(where('invoiceType', 'in', types));
    return onSnapshot(
      query(collection(getFirestore(), 'invoices'), ...constraints),
      (querySnapshot) =>
        resultHandler(querySnapshot.empty ? [] : documentsAs<Invoice>(querySnapshot.docs)),
      (error) => {
        console.error(error);
        Sentry.Native.captureException(error);
      }
    );
  }

  // callables
  async fetchAccountInformation(accountId: string) {
    return (
      await this.functionsRef.getFetchAccountInformationCallable()({
        accountType: 'courier',
        accountId,
        meta: { version: getAppVersion() },
      })
    ).data;
  }
  async requestWithdraw(accountId: string, amount: number) {
    return (
      await this.functionsRef.getRequestWithdrawCallable()({
        accountType: 'courier',
        accountId,
        amount,
        meta: { version: getAppVersion() },
      })
    ).data;
  }
  async fetchReceivables(accountId: string) {
    return (
      await this.functionsRef.getFetchReceivablesCallable()({
        accountType: 'courier',
        accountId,
        meta: { version: getAppVersion() },
      })
    ).data;
  }
  async fetchTotalWithdrawsThisMonth(accountId: string) {
    const now = new Date();
    const firstDayOfMonth = Timestamp.fromDate(
      new Date(now.getUTCFullYear(), now.getUTCMonth(), 1)
    );
    const withdrawsRef = this.firestoreRefs.getWithdrawsRef();

    const withdrawsSnapshot = await getDocs(
      query(
        this.firestoreRefs.getWithdrawsRef(),
        where('accountId', '==', accountId),
        where('createdOn', '>=', firstDayOfMonth)
      )
    );
    return withdrawsSnapshot.size;
  }
  async fetchAdvanceSimulation(
    accountId: string,
    ids: number[]
  ): Promise<IuguMarketplaceAccountAdvanceSimulation> {
    return (
      await this.functionsRef.getFetchAdvanceSimulationCallable()({
        accountType: 'courier',
        accountId,
        ids,
        meta: { version: getAppVersion() },
      })
    ).data;
  }
  async advanceReceivables(accountId: string, ids: number[]): Promise<any> {
    const payload: AdvanceReceivablesPayload = {
      accountType: 'courier',
      accountId,
      ids,
      meta: { version: getAppVersion() },
    };
    return (await this.functionsRef.getAdvanceReceivablesCallable()(payload)).data;
  }
  // storage
  // selfie
  uploadSelfie(id: string, localUri: string, progressHandler?: (progress: number) => void) {
    return this.files.upload(this.storagePaths.getCourierSelfiePath(id), localUri, progressHandler);
  }
  fetchSelfie(id: string, size?: string) {
    return this.files.getDownloadURL(
      this.storagePaths.getCourierSelfiePath(id, !this.emulated && size ? size : undefined)
    );
  }
  // document
  uploadDocumentImage(id: string, localUri: string, progressHandler?: (progress: number) => void) {
    return this.files.upload(
      this.storagePaths.getCourierDocumentPath(id),
      localUri,
      progressHandler
    );
  }
  fetchDocumentImage(id: string, size?: string) {
    return this.files.getDownloadURL(
      this.storagePaths.getCourierDocumentPath(id, !this.emulated && size ? size : undefined)
    );
  }
  // Proof of delivery
  uploadPODPackage(
    orderId: string,
    courierId: string,
    localUri: string,
    progressHandler?: (progress: number) => void
  ) {
    return this.files.upload(
      this.storagePaths.getOrderPODPackagePath(orderId, courierId),
      localUri,
      progressHandler
    );
  }
  uploadPODFront(
    orderId: string,
    courierId: string,
    localUri: string,
    progressHandler?: (progress: number) => void
  ) {
    return this.files.upload(
      this.storagePaths.getOrderPODFrontPath(orderId, courierId),
      localUri,
      progressHandler
    );
  }
}
