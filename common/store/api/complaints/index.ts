import { Complaint } from '@appjusto/types';
import { addDoc } from 'firebase/firestore';
import { FirestoreRefs } from '../../refs/FirestoreRefs';

export default class ComplaintsApi {
  constructor(private firestoreRefs: FirestoreRefs) {}

  // firestore
  async createComplaint(complaint: Complaint) {
    console.log(complaint);
    await addDoc(this.firestoreRefs.getComplaintsRef(), complaint);
  }
}
