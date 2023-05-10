import { Flavor, ProfileChange } from '@appjusto/types';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { FirestoreRefs } from '../../refs/FirestoreRefs';
import { documentsAs } from '../types';

export default class UserApi {
  constructor(private firestoreRefs: FirestoreRefs, private flavor: Flavor) {}

  // firestore
  async fetchPendingChanges(accountId: string) {
    const querySnapshot = await this.firestoreRefs
      .getUsersChangesRef()
      .where('accountId', '==', accountId)
      .where('situation', '==', 'pending')
      .limit(1)
      .get();
    if (querySnapshot.empty) return [];
    return documentsAs<ProfileChange>(querySnapshot.docs);
  }

  async requestProfileChange(accountId: string, changes: Partial<ProfileChange>) {
    await this.firestoreRefs.getUsersChangesRef().add({
      accountId,
      userType: this.flavor === 'courier' ? 'courier' : 'consumer',
      situation: 'pending',
      createdOn:
        FirebaseFirestoreTypes.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
      ...changes,
    } as ProfileChange);
  }
}
