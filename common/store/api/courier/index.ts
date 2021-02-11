import { LatLng, Review } from 'appjusto-types';
import firebase from 'firebase';
import FilesApi from '../files';
import FirebaseRefs from '../FirebaseRefs';

type FetchTotalCouriersNearbyData = {
  total: number;
};

export default class CourierApi {
  constructor(private refs: FirebaseRefs, private files: FilesApi) {}

  // callables
  // submit profile
  async submitProfile() {
    return this.refs.getSubmitProfileCallable()();
  }
  async fetchTotalCouriersNearby(
    location: LatLng,
    distance: number = 15000
  ): Promise<FetchTotalCouriersNearbyData> {
    return (await this.refs.getFetchTotalCouriersNearbyCallable()({ location, distance })).data;
  }
  // firestore
  async addReview(courierId: string, review: Review) {
    await this.refs
      .getCourierReviewsRef(courierId)
      .add({ ...review, createdOn: firebase.firestore.FieldValue.serverTimestamp() } as Review);
  }
  // storage
  // selfie
  uploadSelfie(id: string, localUri: string, progressHandler?: (progress: number) => void) {
    return this.files.upload(this.refs.getCourierSelfieUploadPath(id), localUri, progressHandler);
  }
  fetchSelfie(id: string) {
    return this.files.getDownloadURL(this.refs.getCourierSelfieDownloadPath(id));
  }
  // document
  uploadDocumentImage(id: string, localUri: string, progressHandler?: (progress: number) => void) {
    return this.files.upload(this.refs.getCourierDocumentUploadPath(id), localUri, progressHandler);
  }
  fetchDocumentImage(id: string) {
    return this.files.getDownloadURL(this.refs.getCourierDocumentDownloadPath(id));
  }
}
