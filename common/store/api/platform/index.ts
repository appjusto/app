import { Bank, Cuisine, Issue, IssueType } from 'appjusto-types';
import FilesApi from '../files';
import FirebaseRefs from '../FirebaseRefs';
import { documentsAs } from '../types';

export default class PlatformApi {
  constructor(private refs: FirebaseRefs, private files: FilesApi) {}

  // firestore
  async fetchBanks() {
    const querySnapshot = await this.refs.getBanksRef().get();
    return documentsAs<Bank>(querySnapshot.docs);
  }

  async fetchIssues(type: IssueType) {
    const query = this.refs.getIssuesRef().where('type', '==', type);
    const docs = (await query.get()).docs;
    return documentsAs<Issue>(docs);
  }

  async fetchCuisines() {
    const query = this.refs.getCuisinesRef();
    const docs = (await query.get()).docs;
    return documentsAs<Cuisine>(docs);
  }
  // storage
  fetchCuisineImageURI(imagePath: string) {
    return this.files.getDownloadURL(imagePath);
  }
}
