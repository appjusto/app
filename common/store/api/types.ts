import { WithId } from '@appjusto/types';
import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot } from 'firebase/firestore';

export type FirebaseQueryDocumentSnapshot = QueryDocumentSnapshot<DocumentData>;
export type FirebaseDocumentSnapshot = DocumentSnapshot<DocumentData>;
export type FirebaseDocument = FirebaseQueryDocumentSnapshot | FirebaseDocumentSnapshot;

export const documentAs = <T extends object>(doc: FirebaseDocument): WithId<T> => ({
  ...(doc.data() as T),
  id: doc.id,
});

export const documentsAs = <T extends object>(docs: FirebaseDocument[]): WithId<T>[] =>
  docs.map((doc) => documentAs<T>(doc));
