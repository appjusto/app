import {
  Bank,
  Classification,
  Cuisine,
  Issue,
  IssueType,
  PlatformAccess,
  PlatformParams,
} from '@appjusto/types';
import { getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import FilesApi from '../files';
import FirebaseRefs from '../FirebaseRefs';
import { documentsAs } from '../types';

export default class PlatformApi {
  constructor(private refs: FirebaseRefs, private files: FilesApi) {}

  // firestore
  async fetchPlatformParams() {
    const snapshot = await getDoc(this.refs.getPlatformParamsRef());
    return snapshot.data() as PlatformParams;
  }

  async fetchPlatformAccess() {
    const snapshot = await getDoc(this.refs.getPlatformAccessRef());
    return snapshot.data() as PlatformAccess;
  }

  async fetchBanks() {
    const querySnapshot = await getDocs(query(this.refs.getBanksRef(), orderBy('order', 'asc')));
    return documentsAs<Bank>(querySnapshot.docs);
  }

  async fetchIssues(type: IssueType) {
    const querySnapshot = await getDocs(query(this.refs.getIssuesRef(), where('type', '==', type)));
    return documentsAs<Issue>(querySnapshot.docs);
  }

  async fetchCuisines() {
    const querySnapshot = await getDocs(
      query(this.refs.getCuisinesRef(), where('enabled', '==', true), orderBy('order', 'asc'))
    );
    return documentsAs<Cuisine>(querySnapshot.docs);
  }

  async fetchFoodClassifications() {
    const querySnapshot = await getDocs(this.refs.getClassificationsRef());
    return documentsAs<Classification>(querySnapshot.docs);
  }

  // storage
  fetchCuisineImageURI(imagePath: string) {
    return this.files.getDownloadURL(imagePath);
  }
}
