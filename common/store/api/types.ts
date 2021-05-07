import { WithId } from '@appjusto/types';
import firebase from 'firebase';

export type FirebaseQueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>;
export type FirebaseDocumentSnapshot = firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>;
export type FirebaseDocument = FirebaseQueryDocumentSnapshot | FirebaseDocumentSnapshot;

export const documentAs = <T extends object>(doc: FirebaseDocument): WithId<T> => ({
  ...(doc.data() as T),
  id: doc.id,
});

export const documentsAs = <T extends object>(docs: FirebaseDocument[]): WithId<T>[] =>
  docs.map((doc) => documentAs<T>(doc));
