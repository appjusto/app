import {
  Bank,
  CityStatistics,
  Classification,
  Cuisine,
  Issue,
  IssueType,
  PlatformAccess,
  PlatformParams,
} from '@appjusto/types';
import firebase from 'firebase';
import FilesApi from '../files';
import FirebaseRefs from '../FirebaseRefs';
import { documentsAs } from '../types';

export default class PlatformApi {
  constructor(private refs: FirebaseRefs, private files: FilesApi) {}

  // firestore
  async fetchPlatformParams() {
    const snapshot = await this.refs.getPlatformParamsRef().get();
    return snapshot.data() as PlatformParams;
  }

  async fetchPlatformAccess() {
    const snapshot = await this.refs.getPlatformAccessRef().get();
    return snapshot.data() as PlatformAccess;
  }

  async fetchBanks() {
    const querySnapshot = await this.refs.getBanksRef().orderBy('order', 'asc').get();
    return documentsAs<Bank>(querySnapshot.docs);
  }

  async fetchIssues(type: IssueType) {
    const query = this.refs.getIssuesRef().where('type', '==', type);
    const docs = (await query.get()).docs;
    return documentsAs<Issue>(docs);
  }

  async fetchCuisines() {
    const querySnapshot = await this.refs
      .getCuisinesRef()
      .where('enabled', '==', true)
      .orderBy('order', 'asc')
      .get();
    return documentsAs<Cuisine>(querySnapshot.docs);
  }

  async fetchFoodClassifications() {
    const query = this.refs.getClassificationsRef();
    const docs = (await query.get()).docs;
    return documentsAs<Classification>(docs);
  }

  observeCityStatistics(
    city: string,
    resultHandler: (cityStatistics: CityStatistics | null) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs.getPlatformCityStatisticsRef(city).onSnapshot(
      async (doc) => {
        if (doc.exists) resultHandler(doc.data() as CityStatistics);
        else resultHandler(null);
      },
      (error) => {
        console.log(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  // storage
  fetchCuisineImageURI(imagePath: string) {
    return this.files.getDownloadURL(imagePath);
  }
}
