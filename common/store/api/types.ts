import firebase from 'firebase';

export type FirebaseDocument = firebase.firestore.QueryDocumentSnapshot<
  firebase.firestore.DocumentData
>;
