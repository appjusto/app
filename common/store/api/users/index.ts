import { Flavor, ProfileChange, UserProfile } from '@appjusto/types';
import { addDoc, getDocs, limit, query, serverTimestamp, where } from 'firebase/firestore';
import FirebaseRefs from '../FirebaseRefs';
import { documentsAs } from '../types';

export default class UserApi {
  constructor(private refs: FirebaseRefs, private flavor: Flavor) {}

  // firestore
  async fetchPendingChanges(accountId: string) {
    const querySnapshot = await getDocs(
      query(
        this.refs.getUsersChangesRef(),
        where('accountId', '==', accountId),
        where('situation', '==', 'pending'),
        limit(1)
      )
    );
    if (querySnapshot.empty) return [];
    return documentsAs<ProfileChange>(querySnapshot.docs);
  }

  async requestProfileChange(accountId: string, changes: Partial<UserProfile>) {
    await addDoc(this.refs.getUsersChangesRef(), {
      accountId,
      userType: this.flavor === 'courier' ? 'courier' : 'consumer',
      situation: 'pending',
      createdOn: serverTimestamp(),
      ...changes,
    } as ProfileChange);
  }
}
