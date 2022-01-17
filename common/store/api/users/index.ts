import { Flavor, ProfileChange, UserProfile } from '@appjusto/types';
import firebase from 'firebase/compat';
import FirebaseRefs from '../FirebaseRefs';
import { documentsAs } from '../types';

export default class UserApi {
  constructor(private refs: FirebaseRefs, private flavor: Flavor) {}

  // firestore
  async fetchPendingChanges(accountId: string) {
    const querySnapshot = await this.refs
      .getUsersChangesRef()
      .where('accountId', '==', accountId)
      .where('situation', '==', 'pending')
      .limit(1)
      .get();
    return documentsAs<ProfileChange>(querySnapshot.docs);
  }

  async requestProfileChange(accountId: string, changes: Partial<UserProfile>) {
    await this.refs.getUsersChangesRef().add({
      accountId,
      userType: this.flavor === 'courier' ? 'courier' : 'consumer',
      situation: 'pending',
      createdOn: firebase.firestore.FieldValue.serverTimestamp(),
      ...changes,
    } as ProfileChange);
  }
}
