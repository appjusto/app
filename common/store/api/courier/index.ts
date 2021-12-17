import {
  AdvanceReceivablesPayload,
  CourierOrderRequest,
  FetchAccountInformationPayload,
  FetchAccountInformationResponse,
  FetchAdvanceSimulationPayload,
  FetchReceivablesPayload,
  FetchTotalCouriersNearbyPayload,
  LatLng,
  RequestWithdrawPayload,
  Review,
  VerifyCourierProfilePayload,
} from '@appjusto/types';
import {
  IuguMarketplaceAccountAdvanceSimulation,
  IuguMarketplaceAccountReceivables,
} from '@appjusto/types/payment/iugu';
import firebase from 'firebase';
import * as Sentry from 'sentry-expo';
import { getAppVersion } from '../../../utils/version';
import FilesApi from '../files';
import FirebaseRefs from '../FirebaseRefs';
import { documentAs, documentsAs } from '../types';

type FetchTotalCouriersNearbyData = {
  total: number;
};

export default class CourierApi {
  constructor(private refs: FirebaseRefs, private files: FilesApi) {}

  // firestore
  observePendingOrderRequests(
    courierId: string,
    resultHandler: (orders: CourierOrderRequest[]) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs
      .getCourierRequestsRef(courierId)
      .where('situation', 'in', ['pending', 'viewed'])
      .orderBy('createdOn', 'desc')
      .onSnapshot(
        (querySnapshot) => resultHandler(documentsAs<CourierOrderRequest>(querySnapshot.docs)),
        (error) => {
          console.log(error);
          Sentry.Native.captureException(error);
        }
      );
    // returns the unsubscribe function
    return unsubscribe;
  }
  observeOrderRequest(
    courierId: string,
    orderId: string,
    resultHandler: (order: CourierOrderRequest) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs.getCourierOrderRequestsRef(courierId, orderId).onSnapshot(
      (snapshot) => resultHandler(documentAs<CourierOrderRequest>(snapshot)),
      (error) => {
        console.log(error);
        Sentry.Native.captureException(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }
  viewOrderRequest(courierId: string, orderId: string) {
    return this.refs.getCourierOrderRequestsRef(courierId, orderId).update({
      situation: 'viewed',
    } as Partial<CourierOrderRequest>);
  }
  async addReview(courierId: string, review: Review) {
    await this.refs
      .getCourierReviewsRef(courierId)
      .add({ ...review, createdOn: firebase.firestore.FieldValue.serverTimestamp() } as Review);
  }
  async fetchReview(courierId: string, orderId: string) {
    const query = this.refs
      .getCourierReviewsRef(courierId)
      .where('orderId', '==', orderId)
      .limit(1);
    const docs = (await query.get()).docs;
    return documentsAs<Review>(docs).find(() => true);
  }
  async fetchAllReviews(courierId: string) {
    const query = this.refs.getCourierReviewsRef(courierId);
    const docs = (await query.get()).docs;
    return documentsAs<Review>(docs);
  }
  // callables
  async verifyProfile() {
    const payload: VerifyCourierProfilePayload = {
      meta: { version: getAppVersion() },
    };
    return this.refs.getVerifyProfileCallable()(payload);
  }
  async fetchTotalCouriersNearby(
    location: LatLng,
    distance: number = 15000
  ): Promise<FetchTotalCouriersNearbyData> {
    const payload: FetchTotalCouriersNearbyPayload = {
      location,
      distance,
      meta: { version: getAppVersion() },
    };
    return (await this.refs.getFetchTotalCouriersNearbyCallable()(payload)).data;
  }
  async fetchAccountInformation(accountId: string): Promise<FetchAccountInformationResponse> {
    const payload: FetchAccountInformationPayload = {
      accountType: 'courier',
      accountId,
      meta: { version: getAppVersion() },
    };
    console.log('fetchAccountInformation', payload);
    return (await this.refs.getFetchAccountInformationCallable()(payload)).data;
  }
  async requestWithdraw(accountId: string, amount: number): Promise<any> {
    const payload: RequestWithdrawPayload = {
      accountType: 'courier',
      accountId,
      amount,
      meta: { version: getAppVersion() },
    };
    return (await this.refs.getRequestWithdrawCallable()(payload)).data;
  }
  async fetchReceivables(accountId: string): Promise<IuguMarketplaceAccountReceivables> {
    const payload: FetchReceivablesPayload = {
      accountType: 'courier',
      accountId,
      meta: { version: getAppVersion() },
    };
    return (await this.refs.getFetchReceivablesCallable()(payload)).data;
  }
  async fetchTotalWithdrawsThisMonth(accountId: string) {
    const now = new Date();
    const firstDayOfMonth = firebase.firestore.Timestamp.fromDate(
      new Date(now.getUTCFullYear(), now.getUTCMonth(), 1)
    );
    const withdrawsRef = this.refs.getWithdrawsRef();
    const withdrawsQuery = withdrawsRef
      .where('accountId', '==', accountId)
      .where('createdOn', '>=', firstDayOfMonth);
    const withdrawsSnapshot = await withdrawsQuery.get();
    return withdrawsSnapshot.size;
  }
  async fetchAdvanceSimulation(
    accountId: string,
    ids: number[]
  ): Promise<IuguMarketplaceAccountAdvanceSimulation> {
    const payload: FetchAdvanceSimulationPayload = {
      accountType: 'courier',
      accountId,
      ids,
      meta: { version: getAppVersion() },
    };
    return (await this.refs.getFetchAdvanceSimulationCallable()(payload)).data;
  }
  async advanceReceivables(accountId: string, ids: number[]): Promise<any> {
    const payload: AdvanceReceivablesPayload = {
      accountType: 'courier',
      accountId,
      ids,
      meta: { version: getAppVersion() },
    };
    return (await this.refs.getAdvanceReceivablesCallable()(payload)).data;
  }
  // storage
  // selfie
  uploadSelfie(id: string, localUri: string, progressHandler?: (progress: number) => void) {
    return this.files.upload(this.refs.getCourierSelfiePath(id), localUri, progressHandler);
  }
  fetchSelfie(id: string, size?: string) {
    return this.files.getDownloadURL(this.refs.getCourierSelfiePath(id, size));
  }
  // document
  uploadDocumentImage(id: string, localUri: string, progressHandler?: (progress: number) => void) {
    return this.files.upload(this.refs.getCourierDocumentPath(id), localUri, progressHandler);
  }
  fetchDocumentImage(id: string, size?: string) {
    return this.files.getDownloadURL(this.refs.getCourierDocumentPath(id, size));
  }
  // Proof of delivery
  uploadPODPackage(
    orderId: string,
    courierId: string,
    localUri: string,
    progressHandler?: (progress: number) => void
  ) {
    return this.files.upload(
      this.refs.getOrderPODPackagePath(orderId, courierId),
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
      this.refs.getOrderPODFrontPath(orderId, courierId),
      localUri,
      progressHandler
    );
  }
}
