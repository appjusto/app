import { Flavor, ProfileChange, UserProfile } from '@appjusto/types';
import { addDoc, getDocs, limit, query, serverTimestamp, where } from 'firebase/firestore';
import { FirestoreRefs } from '../../refs/FirestoreRefs';
import { StoragePaths } from '../../refs/StoragePaths';
import FilesApi from '../files';
import { documentsAs } from '../types';

export default class UserApi {
  constructor(
    private firestoreRefs: FirestoreRefs,
    private flavor: Flavor,
    private storagePaths: StoragePaths,
    private files: FilesApi,
    private emulated: boolean
  ) {}

  // firestore
  async fetchPendingChanges(accountId: string) {
    const querySnapshot = await getDocs(
      query(
        this.firestoreRefs.getUsersChangesRef(),
        where('accountId', '==', accountId),
        where('situation', '==', 'pending'),
        limit(1)
      )
    );
    if (querySnapshot.empty) return [];
    return documentsAs<ProfileChange>(querySnapshot.docs);
  }

  async requestProfileChange(accountId: string, changes: Partial<UserProfile>) {
    await addDoc(this.firestoreRefs.getUsersChangesRef(), {
      accountId,
      userType: this.flavor === 'courier' ? 'courier' : 'consumer',
      situation: 'pending',
      createdOn: serverTimestamp(),
      ...changes,
    } as ProfileChange);
  }

  // storage
  // selfie
  uploadSelfie(
    id: string,
    localUri: string,
    flavor: Flavor,
    progressHandler?: (progress: number) => void
  ) {
    if (flavor === 'courier') {
      return this.files.upload(
        this.storagePaths.getCourierSelfiePath(id),
        localUri,
        progressHandler
      );
    } else {
      return this.files.upload(
        this.storagePaths.getConsumerSelfieStoragePath(id),
        localUri,
        progressHandler
      );
    }
  }
  fetchSelfie(id: string, flavor: Flavor, size?: string) {
    if (flavor === 'courier') {
      return this.files.getDownloadURL(
        this.storagePaths.getCourierSelfiePath(id, !this.emulated && size ? size : undefined)
      );
    } else {
      return this.files.getDownloadURL(
        this.storagePaths.getConsumerSelfieStoragePath(
          id,
          !this.emulated && size ? size : undefined
        )
      );
    }
  }
  // document
  uploadDocumentImage(
    id: string,
    localUri: string,
    flavor: Flavor,
    progressHandler?: (progress: number) => void
  ) {
    if (flavor === 'courier') {
      return this.files.upload(
        this.storagePaths.getCourierDocumentPath(id),
        localUri,
        progressHandler
      );
    } else {
      return this.files.upload(
        this.storagePaths.getConsumerDocumentStoragePath(id),
        localUri,
        progressHandler
      );
    }
  }
  fetchDocumentImage(id: string, flavor: Flavor, size?: string) {
    if (flavor === 'courier') {
      return this.files.getDownloadURL(
        this.storagePaths.getCourierDocumentPath(id, !this.emulated && size ? size : undefined)
      );
    } else {
      return this.files.getDownloadURL(
        this.storagePaths.getConsumerDocumentStoragePath(
          id,
          !this.emulated && size ? size : undefined
        )
      );
    }
  }
}
