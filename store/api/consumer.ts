import firebase from 'firebase';

export default class ConsumerApi {
  constructor(
    private firestore: firebase.firestore.Firestore,
    private functions: firebase.functions.Functions
  ) {}
}
