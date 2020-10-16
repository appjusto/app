import { WithId } from 'appjusto-types';
import firebase from 'firebase';

export type FirebaseDocument = firebase.firestore.QueryDocumentSnapshot<
  firebase.firestore.DocumentData
>;

export const documentAs = <T extends object>(docs: FirebaseDocument[]): WithId<T>[] =>
  docs.map((doc) => ({ ...(doc.data() as T), id: doc.id }));
