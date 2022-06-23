import { FirestoreRefs } from '@appjusto/firebase-refs';
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
import { documentsAs } from '../types';

export default class PlatformApi {
  constructor(private firestoreRefs: FirestoreRefs, private files: FilesApi) {}

  // firestore
  async fetchPlatformParams() {
    const snapshot = await getDoc(this.firestoreRefs.getPlatformParamsRef());
    return snapshot.data() as PlatformParams;
  }

  async fetchPlatformAccess() {
    const snapshot = await getDoc(this.firestoreRefs.getPlatformAccessRef());
    return snapshot.data() as PlatformAccess;
  }

  async fetchBanks() {
    const querySnapshot = await getDocs(
      query(this.firestoreRefs.getBanksRef(), orderBy('order', 'asc'))
    );
    return documentsAs<Bank>(querySnapshot.docs);
  }

  async fetchIssues(type: IssueType) {
    const querySnapshot = await getDocs(
      query(this.firestoreRefs.getIssuesRef(), where('type', '==', type))
    );
    return querySnapshot.docs.map((doc) => doc.data() as Issue);
  }

  async fetchCuisines() {
    const querySnapshot = await getDocs(
      query(
        this.firestoreRefs.getCuisinesRef(),
        where('enabled', '==', true),
        orderBy('order', 'asc')
      )
    );
    return documentsAs<Cuisine>(querySnapshot.docs);
  }

  async fetchFoodClassifications() {
    const querySnapshot = await getDocs(this.firestoreRefs.getClassificationsRef());
    return documentsAs<Classification>(querySnapshot.docs);
  }

  // storage
  fetchCuisineImageURI(imagePath: string) {
    return this.files.getDownloadURL(imagePath);
  }
}
