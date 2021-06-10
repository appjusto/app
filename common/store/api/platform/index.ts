import {
  Bank,
  CityStatistics,
  Classification,
  Cuisine,
  Issue,
  IssueType,
  PlatformParams,
} from '@appjusto/types';
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
    const querySnapshot = await this.refs.getCuisinesRef().orderBy('order', 'asc').get();
    return documentsAs<Cuisine>(querySnapshot.docs);
  }

  async fetchFoodClassifications() {
    const query = this.refs.getClassificationsRef();
    const docs = (await query.get()).docs;
    return documentsAs<Classification>(docs);
  }
  async fetchCityStatistics(city: string) {
    const snapshot = await this.refs.getPlatformCityStatisticsRef(city).get();
    return snapshot.data() as CityStatistics;
  }
  // storage
  fetchCuisineImageURI(imagePath: string) {
    return this.files.getDownloadURL(imagePath);
  }
}
