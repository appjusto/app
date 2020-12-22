import { Bank, LatLng, WithId } from 'appjusto-types';
import firebase from 'firebase';
import FilesApi from './files';

type FetchTotalCouriersNearbyData = {
  total: number;
};

export default class CourierApi {
  constructor(
    private firestore: firebase.firestore.Firestore,
    private functions: firebase.functions.Functions,
    private files: FilesApi
  ) {}

  // callables
  // submit profile
  async submitProfile() {
    return this.functions.httpsCallable('submitProfile')();
  }

  async fetchTotalCouriersNearby(
    location: LatLng,
    distance: number = 15000
  ): Promise<FetchTotalCouriersNearbyData> {
    return (await this.functions.httpsCallable('fetchTotalCouriersNearby')({ location, distance }))
      .data;
  }

  // firestore
  // fetch supported banks
  async fetchBanks() {
    const querySnapshot = await this.firestore
      .collection('platform')
      .doc('data')
      .collection('banks')
      .get();
    const docs: WithId<Bank>[] = [];
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        docs.push({ ...(doc.data() as Bank), id: doc.id });
      });
    }
    return docs;
  }

  // storage
  // selfie
  uploadSelfie(id: string, localUri: string, progressHandler?: (progress: number) => void) {
    const selfiePath = `couriers/${id}/selfie.jpg`;
    return this.files.upload(selfiePath, localUri, progressHandler);
  }
  fetchSelfie(id: string) {
    const selfiePath = `couriers/${id}/selfie_160x160.jpg`;
    return this.files.getDownloadURL(selfiePath);
  }
  // document
  uploadDocumentImage(id: string, localUri: string, progressHandler?: (progress: number) => void) {
    const documentImagePath = `couriers/${id}/document.jpg`;
    return this.files.upload(documentImagePath, localUri, progressHandler);
  }
  fetchDocumentImage(id: string) {
    const documentImagePath = `couriers/${id}/document_160x160.jpg`;
    return this.files.getDownloadURL(documentImagePath);
  }
}
