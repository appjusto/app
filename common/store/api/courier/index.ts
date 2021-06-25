import {
  CourierOrderRequest,
  FetchTotalCouriersNearbyPayload,
  LatLng,
  Review,
  VerifyCourierProfilePayload,
} from '@appjusto/types';
import Constants from 'expo-constants';
import firebase from 'firebase';
import * as Sentry from 'sentry-expo';
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
      .where('situation', '==', 'pending')
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
      meta: { version: Constants.nativeBuildVersion },
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
      meta: { version: Constants.nativeBuildVersion },
    };
    return (await this.refs.getFetchTotalCouriersNearbyCallable()(payload)).data;
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
