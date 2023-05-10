import {
  Bank,
  Classification,
  Cuisine,
  Issue,
  IssueType,
  PlatformAccess,
  PlatformFees,
  PlatformParams,
} from '@appjusto/types';
import { FirestoreRefs } from '../../refs/FirestoreRefs';
import FilesApi from '../files';
import { documentsAs } from '../types';

export default class PlatformApi {
  constructor(private firestoreRefs: FirestoreRefs, private files: FilesApi) {}

  // firestore
  async fetchPlatformParams() {
    const snapshot = await this.firestoreRefs.getPlatformParamsRef().get();
    return snapshot.data() as PlatformParams;
  }

  async fetchPlatformFees() {
    const snapshot = await this.firestoreRefs.getPlatformFeesRef().get();
    return snapshot.data() as PlatformFees;
  }

  async fetchPlatformAccess() {
    const snapshot = await this.firestoreRefs.getPlatformAccessRef().get();
    return snapshot.data() as PlatformAccess;
  }

  async fetchBanks() {
    const querySnapshot = await this.firestoreRefs.getBanksRef().orderBy('order', 'asc').get();
    return documentsAs<Bank>(querySnapshot.docs);
  }

  async fetchIssues(type: IssueType) {
    const querySnapshot = await this.firestoreRefs.getIssuesRef().where('type', '==', type).get();
    return querySnapshot.docs.map((doc) => doc.data() as Issue);
  }

  async fetchCuisines() {
    const querySnapshot = await this.firestoreRefs
      .getCuisinesRef()
      .where('enabled', '==', true)
      .orderBy('order', 'asc')
      .get();
    return documentsAs<Cuisine>(querySnapshot.docs);
  }

  async fetchFoodClassifications() {
    const querySnapshot = await this.firestoreRefs.getClassificationsRef().get();
    return documentsAs<Classification>(querySnapshot.docs);
  }

  // storage
  fetchCuisineImageURI(imagePath: string) {
    return this.files.getDownloadURL(imagePath);
  }
}
